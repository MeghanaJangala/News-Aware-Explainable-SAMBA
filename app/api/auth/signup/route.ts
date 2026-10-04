import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: 'All fields are required',
        },
        {
          status: 400,
        }
      )
    }

    // Validate password
    if (password.length < 8) {
      return NextResponse.json(
        {
          message: 'Password must be at least 8 characters',
        },
        {
          status: 400,
        }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Check whether account already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    })

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            'An account with this email already exists',
        },
        {
          status: 409,
        }
      )
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(
      password,
      10
    )

    // Create user
    await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    })

    return NextResponse.json(
      {
        message: 'Account created successfully',
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error('Signup error:', error)

    return NextResponse.json(
      {
        message: 'Something went wrong',
      },
      {
        status: 500,
      }
    )
  }
}