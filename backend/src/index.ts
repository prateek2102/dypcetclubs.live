// import express from "express";
// import dotenv from "dotenv";
// import { PrismaClient } from "@prisma/client";
// import { PrismaLibSQL } from "@prisma/adapter-libsql";
// import { createClient } from "@libsql/client";
// import bcrypt from "bcrypt";
// import cors from "cors";
// import rateLimit from "express-rate-limit";

// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(cors());

// const libsql = createClient({
//   url: `${process.env.TURSO_DATABASE_URL}`,
//   authToken: `${process.env.TURSO_AUTH_TOKEN}`,
// });

// const adapter = new PrismaLibSQL(libsql);
// const prisma = new PrismaClient({ adapter });

// // Route to get all tables in the database
// app.get("/tables", async (req, res) => {
//   try {
//     const tables =
//       await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table';`;
//     res.json(tables);
//   } catch (error) {
//     console.error("Error fetching tables:", error);
//     res.status(500).json({ error: "An error occurred while fetching tables." });
//   }
// });

// //Route to get all club data
// app.get("/getClubData", async (req, res) => {
//   try {
//     const data = await prisma.club.findMany({
//       include: {
//         Members: true,
//         Events: true,
//         Announcements: true,
//         ClubImages: true,
//       },
//     });
//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "An error occurred while fetching data." });
//   }
// });

// //Route to get all event data
// app.get("/getEventData", async (req, res) => {
//   try {
//     const clubs = await prisma.event.findMany(); // Fetch all clubs from the database
//     res.json(clubs);
//   } catch (error) {
//     console.error("Error fetching clubs:", error);
//     res.status(500).json({ error: "Failed to fetch clubs" });
//   }
// });

// //add club
// app.post("/addClub", async (req, res) => {
//   try {
//     const { ClubName, Description, FoundedDate, Email, Password, LogoURL } =
//       req.body;

//     if (!ClubName || !Email || !Password) {
//       return res
//         .status(400)
//         .json({ error: "ClubName, Email, and Password are required." });
//     }
//     const hashedPassword = await bcrypt.hash(Password, 10);

//     // Store password in plain text for testing purposes
//     const newClub = await prisma.club.create({
//       data: {
//         ClubName,
//         Description,
//         FoundedDate,
//         Email,
//         Password: hashedPassword, // Store the hashed text password
//         LogoURL,
//       },
//     });

//     res.status(201).json(newClub);
//   } catch (error) {
//     console.error("Error creating club:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// const rateLimmiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // Limit each IP to 5 login attempts per windowMs
//   message: "Too many login attempts, please try again later.",
// });

// // Login endpoint comparing plain text passwords
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required." });
//   }

//   try {
//     const club = await prisma.club.findUnique({
//       where: { Email: email },
//     });

//     if (!club) {
//       console.log(`Club not found for email: ${email}`);
//       return res.status(404).json({ error: "Club data not found." });
//     }

//     // Compare the entered password with the stored plain text password
//     //using bcrypt
//     const passwordMatch = await bcrypt.compare(password, club.Password);

//     // Debugging logs
//     console.log("Entered password:", password);
//     console.log("Stored plain text password:", club.Password);
//     console.log("Password match result:", passwordMatch);

//     if (!passwordMatch) {
//       console.log(`Password mismatch for email: ${email}`);
//       return res.status(401).json({ error: "Invalid email or password." });
//     }

//     console.log(`Login successful for email: ${email}`);
//     club.Password = "encrypted";
//     res.status(200).json({ message: "Login successful.", club: club });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ error: "An error occurred during login." });
//   }
// });

// //create a new event by the club
// app.post("/api/create-event", async (req: any, res: any) => {
//   const { EventName, Description, StartDateTime, EndDateTime, Location } =
//     req.body;
//   const clubId = Number(req.query.ClubID);

//   try {
//     const newEvent = await prisma.event.create({
//       data: {
//         EventName,
//         Description,
//         StartDateTime,
//         EndDateTime,
//         Location,
//         ClubID: clubId,
//       },
//     });
//     res.status(201).json(newEvent);
//   } catch (error) {
//     console.error("Error creating event:", error);
//     res.status(500).json({
//       error: "An error occurred while creating the event",
//       details: error,
//     });
//   }
// });

// //update an event by the club
// app.put("/api/update-event", async (req: any, res: any) => {
//   const {
//     EventID,
//     EventName,
//     Description,
//     StartDateTime,
//     EndDateTime,
//     Location,
//   } = req.body;
//   const clubId = Number(req.query.ClubID);
//   try {
//     const updatedEvent = await prisma.event.update({
//       where: { EventID },
//       data: {
//         EventName,
//         Description,
//         StartDateTime,
//         EndDateTime,
//         Location,
//       },
//     });
//     res.json(updatedEvent);
//   } catch (error) {
//     console.error("Error updating event:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// //get all the events created by a specific club
// app.get("/api/getEventData", async (req: any, res: any) => {
//   const clubId = Number(req.query.ClubID);
//   try {
//     const events = await prisma.event.findMany({
//       where: { ClubID: clubId },
//     });
//     res.json(events);
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     res.status(500).json({ error: "An error occurred while fetching events." });
//   }
// });

// app.delete("/api/deleteEvent", async (req: any, res: any) => {
//   const { eventId } = req.body;
//   const clubId = Number(req.query.ClubID);

//   try {
//     const event = await prisma.event.findUnique({
//       where: { EventID: eventId },
//     });

//     if (!event) {
//       return res.status(404).json({ error: "Event not found." });
//     }

//     if (event.ClubID !== clubId) {
//       console.log("clubid1: " + event.ClubID);
//       console.log("clubid2: " + clubId);
//       return res.status(403).json({
//         error: "You are not authorized to delete this event.",
//       });
//     }

//     await prisma.event.delete({
//       where: { EventID: eventId },
//     });

//     res.status(204).end();
//   } catch (error) {
//     console.error("Error deleting event:", error);
//     res.status(500).json({ error: "An error occurred while deleting event." });
//   }
// });

// //create quiz
// app.post("/api/quizzes", async (req: any, res) => {
//   const { title, questions, secretCode } = req.body;
//   const clubId = Number(req.query.ClubID);

//   if (!secretCode || typeof secretCode !== "string") {
//     return res.status(400).json({ error: "Invalid secretCode" });
//   }

//   try {
//     const hashedSecretCode = await bcrypt.hash(secretCode, 10);
//     const quiz = await prisma.quiz.create({
//       data: {
//         title,
//         secretCode: hashedSecretCode,
//         clubId: clubId,
//       },
//     });

//     await Promise.all(
//       questions.map((q: any) =>
//         prisma.question.create({
//           data: {
//             question: q.question,
//             options: q.options,
//             correctAnswer: q.correctAnswer,
//             quizId: quiz.id,
//           },
//         }),
//       ),
//     );

//     res.json({ quizId: quiz.id });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to create quiz" });
//   }
// });

// // Get quizzes for a club
// app.get("/api/quizzes", async (req: any, res) => {
//   const clubId = Number(req.query.ClubID);
//   try {
//     const quizzes = await prisma.quiz.findMany({
//       where: { clubId: clubId },
//       select: { id: true, title: true, createdAt: true },
//     });
//     res.json(quizzes);
//   } catch (error) {
//     console.log("error11");
//     console.log(error);
//     res.status(500).json({ error: "Failed to retrieve quizzes" });
//   }
// });

// // Get quiz by ID (only if secret code is correct)
// app.post("/api/quizzes/:id", async (req, res) => {
//   const { id } = req.params;
//   const { secretCode } = req.body;

//   try {
//     const quiz = await prisma.quiz.findUnique({
//       where: { id: parseInt(id) },
//       include: { questions: true },
//     });

//     if (!quiz) {
//       return res.status(404).json({ error: "Quiz not found" });
//     }

//     const isSecretCodeValid = await bcrypt.compare(secretCode, quiz.secretCode);
//     if (!isSecretCodeValid) {
//       return res.status(403).json({ error: "Invalid secret code" });
//     }

//     res.json(quiz);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve quiz" });
//   }
// });

// // Create a new user for quiz
// app.post("/api/users", async (req, res) => {
//   const { name, rollNo, year } = req.body;
//   const parsedYear = parseInt(year);
//   try {
//     const user = await prisma.user.create({
//       data: { name, rollNo, year: parsedYear },
//     });
//     res.json(user);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to create user" });
//   }
// });

// // Submit quiz result
// app.post("/api/quizzes/:id/submit", async (req, res) => {
//   const { id } = req.params;
//   const { userId, answers, score } = req.body;

//   try {
//     const result = await prisma.result.create({
//       data: {
//         score,
//         answers: JSON.stringify(answers),
//         quiz: { connect: { id: parseInt(id) } },
//         user: { connect: { id: userId } },
//       },
//     });
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to submit quiz result" });
//   }
// });

// // Get quiz results for admin panel
// app.get("/api/quizzes/:id/results", async (req: any, res) => {
//   const { id } = req.params;
//   const clubId = Number(req.query.ClubID);

//   try {
//     const quiz = await prisma.quiz.findUnique({
//       where: { id: parseInt(id) },
//       include: { club: true },
//     });

//     if (!quiz || quiz.clubId !== clubId) {
//       return res.status(403).json({ error: "Access denied" });
//     }

//     const results = await prisma.result.findMany({
//       where: { quizId: parseInt(id) },
//       include: { user: true },
//     });
//     res.json(results);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to retrieve quiz results" });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
