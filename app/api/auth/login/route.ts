import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          message: 'Email and password are required',
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

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    })

    // Don't reveal whether email exists
    if (!user) {
      return NextResponse.json(
        {
          message: 'Invalid email or password',
        },
        {
          status: 401,
        }
      )
    }

    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return NextResponse.json(
        {
          message: 'Invalid email or password',
        },
        {
          status: 401,
        }
      )
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error('Login error:', error)

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