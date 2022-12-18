import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";

import { UserController, PostController } from "./controllers/index.js";
import { checkAuth, handelValidationsErrors } from "./utils/index.js";

mongoose.set("strictQuery", false);

// mongodb+srv://admin:MMAfighter03@cluster0.x1zbe89.mongodb.net/blog?retryWrites=true&w=majority

mongoose
  .connect(
    "mongodb://mongo:8uZKYJ4zV3vGGQGRSWeu@containers-us-west-141.railway.app:6079"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("err", err));

const app = express();

app.get('/', (req, res) => {
  res.send('Hello wolrd')
})


const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handelValidationsErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handelValidationsErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/tags", PostController.getLastsTags);

app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastsTags);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handelValidationsErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handelValidationsErrors,
  PostController.update
);

// 4444

app.listen(3000, (err) => {
  if (err) throw err;

  console.log("Server OK");
});

