import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

const db =  async (): Promise<void>=>{
    if(connection.isConnected){
        console.log("Already connected database.")
    }
    try {
        const conn = await mongoose.connect(process.env.DB_URI || '', {})
        connection.isConnected = conn.connections[0].readyState
        console.log("database connected successfully")
    } catch (error:any) {
        console.log("Database connection failed", error)
        process.exit(1)
    }
}

export default db