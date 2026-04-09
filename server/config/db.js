import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`)
    // Do not exit process, allow server to run and potentially reconnect
    console.log('Server continuing without database connection. Features requiring DB will fail.')
  }
}

export default connectDB
