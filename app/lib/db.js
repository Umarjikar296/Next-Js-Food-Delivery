const { username, password } = process.env
export const connectionStr = "mongodb+srv://" + username + ":" + password + "@cluster0.vsc8y69.mongodb.net/restedb?appName=Cluster0";
