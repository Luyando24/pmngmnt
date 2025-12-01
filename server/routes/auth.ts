import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  LoginRequest,
  AuthSession,
  ResidentRegistrationRequest,
} from "@shared/api";
import { query, hashPassword, verifyPassword, hashNationalId } from "../lib/db";

// Helper to generate 8-character card ID
function generateCardId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ============================================
// CITIZEN/RESIDENT REGISTRATION
// ============================================
export const handleRegisterResident: RequestHandler = async (req, res) => {
  try {
    const residentData: ResidentRegistrationRequest = req.body;

    console.log('Registration attempt:', {
      nrc: residentData.nrc,
      passport: residentData.passportNumber,
      email: residentData.email
    });

    // Validate required fields
    if (!residentData.firstName || !residentData.lastName || !residentData.dob) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if NRC already exists (for Zambian citizens)
    if (residentData.nrc) {
      const nrcHash = hashNationalId(residentData.nrc);
      const existingNrc = await query(
        'SELECT id FROM residents WHERE national_id_hash = $1',
        [nrcHash]
      );

      if (existingNrc.rows.length > 0) {
        return res.status(400).json({ error: "NRC already registered" });
      }
    }

    // Check if passport already exists (for foreign nationals)
    if (residentData.passportNumber) {
      const existingPassport = await query(
        'SELECT id FROM residents WHERE passport_number = $1',
        [residentData.passportNumber]
      );

      if (existingPassport.rows.length > 0) {
        return res.status(400).json({ error: "Passport number already registered" });
      }
    }

    // Check if email already exists
    if (residentData.email) {
      const existingEmail = await query(
        'SELECT id FROM residents WHERE email = $1',
        [residentData.email]
      );

      if (existingEmail.rows.length > 0) {
        return res.status(400).json({ error: "Email already registered" });
      }
    }

    // Generate IDs
    const residentId = uuidv4();
    const cardId = generateCardId();
    const nrcHash = residentData.nrc ? hashNationalId(residentData.nrc) : null;

    // Create password hash if password provided
    let passwordHash = null;
    if (residentData.password) {
      passwordHash = await hashPassword(residentData.password);
    }

    // Insert new resident
    await query(
      `INSERT INTO residents (
        id, nrc, passport_number, national_id_hash, first_name, last_name,
        gender, date_of_birth, nationality, residency_status, phone, email,
        address, occupation, marital_status, emergency_contact_name,
        emergency_contact_phone, card_id, password_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        residentId,
        residentData.nrc || null,
        residentData.passportNumber || null,
        nrcHash,
        residentData.firstName,
        residentData.lastName,
        residentData.gender || null,
        residentData.dob,
        residentData.nationality || 'Zambia',
        residentData.residencyStatus || 'citizen',
        residentData.phone || null,
        residentData.email || null,
        residentData.address || null,
        residentData.occupation || null,
        residentData.maritalStatus || 'single',
        residentData.emergencyContactName || null,
        residentData.emergencyContactPhone || null,
        cardId,
        passwordHash
      ]
    );

    console.log('✅ Resident registered successfully:', residentId);

    // Return success with session
    const session: AuthSession = {
      userId: residentId,
      role: "resident",
      residentId: residentId,
      tokens: {
        accessToken: `token_${residentId}`,
        expiresInSec: 3600,
      },
    };

    res.status(201).json({
      ...session,
      resident: {
        id: residentId,
        cardId,
        firstName: residentData.firstName,
        lastName: residentData.lastName,
        email: residentData.email,
      }
    });
  } catch (error) {
    console.error("Error registering resident:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ============================================
// CITIZEN/RESIDENT LOGIN
// ============================================
export const handleResidentLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password, nrc }: any = req.body;

    console.log('Login attempt:', { email, nrc: nrc ? '***' : undefined });

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    let result;

    if (email) {
      // Login with email
      result = await query(
        'SELECT id, first_name, last_name, email, password_hash FROM residents WHERE email = $1',
        [email]
      );
    } else if (nrc) {
      // Login with NRC
      result = await query(
        'SELECT id, first_name, last_name, email, password_hash FROM residents WHERE nrc = $1',
        [nrc]
      );
    } else {
      return res.status(400).json({ error: "Email or NRC is required" });
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const resident = result.rows[0];

    if (!resident.password_hash) {
      return res.status(401).json({ error: "Account not set up for password login" });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, resident.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log('✅ Login successful:', resident.id);

    const session: AuthSession = {
      userId: resident.id,
      role: "resident",
      residentId: resident.id,
      tokens: {
        accessToken: `token_${resident.id}`,
        expiresInSec: 3600,
      },
    };

    res.json(session);
  } catch (error) {
    console.error('Resident login error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ============================================
// OFFICER LOGIN (Police or Immigration)
// ============================================
export const handleOfficerLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Try police officers first
    let result = await query(
      'SELECT id, officer_id, email, password_hash, rank as role, first_name, last_name, is_active, \'police\' as officer_type FROM officers WHERE email = $1',
      [email]
    );

    // If not found, try immigration officers
    if (result.rows.length === 0) {
      result = await query(
        'SELECT id, officer_id, email, password_hash, office_location as role, first_name, last_name, is_active, \'immigration\' as officer_type FROM immigration_officers WHERE email = $1',
        [email]
      );
    }

    // If still not found, try admin users
    if (result.rows.length === 0) {
      result = await query(
        'SELECT id, email, password_hash, role, first_name, last_name, is_active, \'admin\' as officer_type FROM admin_users WHERE email = $1',
        [email]
      );
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const officer = result.rows[0];

    // Verify password
    const isValidPassword = await verifyPassword(password, officer.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!officer.is_active) {
      return res.status(401).json({ error: "Account is inactive" });
    }

    const session: AuthSession = {
      userId: officer.id,
      role: officer.officer_type,
      tokens: {
        accessToken: `token_${officer.id}`,
        expiresInSec: 3600,
      },
    };

    res.json(session);
  } catch (error) {
    console.error('Officer login error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};