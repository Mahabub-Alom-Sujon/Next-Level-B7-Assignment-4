
            import { createRequire } from 'module';
            const require = createRequire(import.meta.url);
        
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server.ts
import "dotenv/config";

// src/app.ts
import express3 from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config_default = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  stripe_product_id: process.env.STRIPE_PRODUCT_ID
};

// src/middlewares/not-found.ts
import httpStatus from "http-status";
var notFoundHandler = (req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: `Not Found - Cannot ${req.method} ${req.originalUrl}`
  });
};

// src/middlewares/global-error.ts
import httpStatus2 from "http-status";

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Users {\n  id               String             @id @default(uuid())\n  name             String\n  email            String             @unique\n  password         String\n  phone            String?            @unique\n  profileImage     String?\n  address          String?\n  city             String?\n  district         String?\n  postalCode       String?\n  role             UserRole           @default(CUSTOMER)\n  status           UserStatus         @default(ACTIVE)\n  isVerified       Boolean            @default(false)\n  isActive         Boolean            @default(true)\n  technician       TechnicianProfile?\n  customerBookings Booking[]          @relation("CustomerBookings")\n  reviews          Review[]\n  createdAt        DateTime           @default(now())\n  updatedAt        DateTime           @default(now()) @updatedAt\n}\n\nmodel TechnicianProfile {\n  id            String             @id @default(uuid())\n  bio           String?\n  experience    Int                @default(0)\n  hourlyRate    Int? // stored in smallest currency unit (e.g., 50000 = 500.00 BDT)\n  skills        String?\n  nationalId    String?\n  certification String?\n  averageRating Float              @default(0)\n  totalReviews  Int                @default(0)\n  completedJobs Int                @default(0)\n  isAvailable   Boolean            @default(true)\n  services      Service[]\n  bookings      Booking[]\n  reviews       Review[]\n  availability  AvailabilitySlot[]\n  userId        String             @unique\n  user          Users              @relation(fields: [userId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  createdAt     DateTime           @default(now())\n  updatedAt     DateTime           @default(now()) @updatedAt\n}\n\nmodel AvailabilitySlot {\n  id           String   @id @default(cuid())\n  technicianId String\n  dayOfWeek    Int // 0 = Sunday ... 6 = Saturday\n  startTime    String // e.g. "09:00"\n  endTime      String // e.g. "17:00"\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  // Relation\n  technician TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  @@unique([technicianId, dayOfWeek, startTime, endTime])\n}\n\nmodel Category {\n  id          String    @id @default(uuid())\n  name        String    @unique\n  description String?\n  icon        String?\n  services    Service[]\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime  @default(now()) @updatedAt\n}\n\nmodel Service {\n  id           String            @id @default(uuid())\n  title        String\n  description  String?\n  price        Int // smallest currency unit (e.g., 150000 = 1,500.00 BDT)\n  duration     Int // Minutes\n  serviceArea  String?\n  isAvailable  Boolean           @default(true)\n  featured     Boolean?          @default(false)\n  bookings     Booking[]\n  technicianId String\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  categoryId   String\n  category     Category          @relation(fields: [categoryId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  createdAt    DateTime          @default(now())\n  updatedAt    DateTime          @default(now()) @updatedAt\n}\n\nmodel Booking {\n  id           String            @id @default(uuid())\n  bookingDate  DateTime\n  bookingTime  String?\n  note         String?\n  // totalAmount  Decimal           @db.Decimal(10, 2)\n  status       BookingStatus     @default(REQUESTED)\n  payments     Payment?\n  review       Review?\n  customerId   String\n  customer     Users             @relation("CustomerBookings", fields: [customerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  technicianId String\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  serviceId    String\n  service      Service           @relation(fields: [serviceId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  createdAt    DateTime          @default(now())\n  updatedAt    DateTime          @default(now()) @updatedAt\n}\n\nmodel Payment {\n  id            String          @id @default(uuid())\n  bookingId     String          @unique\n  booking       Booking         @relation(fields: [bookingId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  transactionId String?         @unique\n  amount        Decimal         @db.Decimal(10, 2)\n  provider      PaymentProvider @default(STRIPE)\n  method        PaymentMethod   @default(CARD)\n  status        PaymentStatus   @default(PENDING)\n  paidAt        DateTime?\n  createdAt     DateTime        @default(now())\n  updatedAt     DateTime        @updatedAt\n}\n\nmodel Review {\n  id           String            @id @default(uuid())\n  rating       Int\n  comment      String?\n  bookingId    String            @unique\n  booking      Booking           @relation(fields: [bookingId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  customerId   String\n  customer     Users             @relation(fields: [customerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  technicianId String\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  createdAt    DateTime          @default(now())\n  updatedAt    DateTime          @default(now()) @updatedAt\n}\n\nenum UserRole {\n  CUSTOMER\n  TECHNICIAN\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  BLOCKED\n}\n\nenum BookingStatus {\n  REQUESTED\n  ACCEPTED\n  DECLINED\n  PAID\n  IN_PROGRESS\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentProvider {\n  STRIPE\n}\n\nenum PaymentMethod {\n  CARD\n  MOBILE_BANKING\n  BANK\n  CASH\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n  REFUNDED\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Users":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"profileImage","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"district","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"TechnicianProfileToUsers"},{"name":"customerBookings","kind":"object","type":"Booking","relationName":"CustomerBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUsers"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TechnicianProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"hourlyRate","kind":"scalar","type":"Int"},{"name":"skills","kind":"scalar","type":"String"},{"name":"nationalId","kind":"scalar","type":"String"},{"name":"certification","kind":"scalar","type":"String"},{"name":"averageRating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"completedJobs","kind":"scalar","type":"Int"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"services","kind":"object","type":"Service","relationName":"ServiceToTechnicianProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTechnicianProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTechnicianProfile"},{"name":"availability","kind":"object","type":"AvailabilitySlot","relationName":"AvailabilitySlotToTechnicianProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"Users","relationName":"TechnicianProfileToUsers"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"AvailabilitySlot":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"dayOfWeek","kind":"scalar","type":"Int"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"AvailabilitySlotToTechnicianProfile"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"services","kind":"object","type":"Service","relationName":"CategoryToService"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Service":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"serviceArea","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"featured","kind":"scalar","type":"Boolean"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToService"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"ServiceToTechnicianProfile"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToService"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingDate","kind":"scalar","type":"DateTime"},{"name":"bookingTime","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"payments","kind":"object","type":"Payment","relationName":"BookingToPayment"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"Users","relationName":"CustomerBookings"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"BookingToTechnicianProfile"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"service","kind":"object","type":"Service","relationName":"BookingToService"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"method","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"Users","relationName":"ReviewToUsers"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"ReviewToTechnicianProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","booking","payments","customer","technician","review","service","bookings","services","_count","category","reviews","availability","user","customerBookings","Users.findUnique","Users.findUniqueOrThrow","Users.findFirst","Users.findFirstOrThrow","Users.findMany","data","Users.createOne","Users.createMany","Users.createManyAndReturn","Users.updateOne","Users.updateMany","Users.updateManyAndReturn","create","update","Users.upsertOne","Users.deleteOne","Users.deleteMany","having","_min","_max","Users.groupBy","Users.aggregate","TechnicianProfile.findUnique","TechnicianProfile.findUniqueOrThrow","TechnicianProfile.findFirst","TechnicianProfile.findFirstOrThrow","TechnicianProfile.findMany","TechnicianProfile.createOne","TechnicianProfile.createMany","TechnicianProfile.createManyAndReturn","TechnicianProfile.updateOne","TechnicianProfile.updateMany","TechnicianProfile.updateManyAndReturn","TechnicianProfile.upsertOne","TechnicianProfile.deleteOne","TechnicianProfile.deleteMany","_avg","_sum","TechnicianProfile.groupBy","TechnicianProfile.aggregate","AvailabilitySlot.findUnique","AvailabilitySlot.findUniqueOrThrow","AvailabilitySlot.findFirst","AvailabilitySlot.findFirstOrThrow","AvailabilitySlot.findMany","AvailabilitySlot.createOne","AvailabilitySlot.createMany","AvailabilitySlot.createManyAndReturn","AvailabilitySlot.updateOne","AvailabilitySlot.updateMany","AvailabilitySlot.updateManyAndReturn","AvailabilitySlot.upsertOne","AvailabilitySlot.deleteOne","AvailabilitySlot.deleteMany","AvailabilitySlot.groupBy","AvailabilitySlot.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Service.findUnique","Service.findUniqueOrThrow","Service.findFirst","Service.findFirstOrThrow","Service.findMany","Service.createOne","Service.createMany","Service.createManyAndReturn","Service.updateOne","Service.updateMany","Service.updateManyAndReturn","Service.upsertOne","Service.deleteOne","Service.deleteMany","Service.groupBy","Service.aggregate","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","Booking.groupBy","Booking.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","rating","comment","bookingId","customerId","technicianId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","transactionId","amount","PaymentProvider","provider","PaymentMethod","method","PaymentStatus","status","paidAt","bookingDate","bookingTime","note","BookingStatus","serviceId","title","description","price","duration","serviceArea","isAvailable","featured","categoryId","name","icon","every","some","none","dayOfWeek","startTime","endTime","bio","experience","hourlyRate","skills","nationalId","certification","averageRating","totalReviews","completedJobs","userId","email","password","phone","profileImage","address","city","district","postalCode","UserRole","role","UserStatus","isVerified","isActive","technicianId_dayOfWeek_startTime_endTime","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "xQRPgAEWBgAArQIAIA0AAKACACAQAACfAgAgmQEAAKoCADCaAQAAJQAQmwEAAKoCADCcAQEAAAABogFAAIECACGjAUAAgQIAIbYBAACsAuIBIsUBAQCQAgAh1wEBAAAAAdgBAQCQAgAh2QEBAAAAAdoBAQCRAgAh2wEBAJECACHcAQEAkQIAId0BAQCRAgAh3gEBAJECACHgAQAAqwLgASLiASAAngIAIeMBIACeAgAhAQAAAAEAIBYJAACfAgAgCgAAkgIAIA0AAKACACAOAAChAgAgDwAAogIAIJkBAACaAgAwmgEAAAMAEJsBAACaAgAwnAEBAJACACGiAUAAgQIAIaMBQACBAgAhwgEgAJ4CACHNAQEAkQIAIc4BAgCbAgAhzwECAJwCACHQAQEAkQIAIdEBAQCRAgAh0gEBAJECACHTAQgAnQIAIdQBAgCbAgAh1QECAJsCACHWAQEAkAIAIQEAAAADACASBgAAsAIAIAkAAJ8CACAMAAC5AgAgmQEAALcCADCaAQAABQAQmwEAALcCADCcAQEAkAIAIaEBAQCQAgAhogFAAIECACGjAUAAgQIAIb0BAQCQAgAhvgEBAJECACG_AQIAmwIAIcABAgCbAgAhwQEBAJECACHCASAAngIAIcMBIAC4AgAhxAEBAJACACEGBgAAggQAIAkAANwDACAMAACGBAAgvgEAALoCACDBAQAAugIAIMMBAAC6AgAgEgYAALACACAJAACfAgAgDAAAuQIAIJkBAAC3AgAwmgEAAAUAEJsBAAC3AgAwnAEBAAAAAaEBAQCQAgAhogFAAIECACGjAUAAgQIAIb0BAQCQAgAhvgEBAJECACG_AQIAmwIAIcABAgCbAgAhwQEBAJECACHCASAAngIAIcMBIAC4AgAhxAEBAJACACEDAAAABQAgAQAABgAwAgAABwAgEgQAALQCACAFAACiAgAgBgAAsAIAIAcAALUCACAIAAC2AgAgmQEAALICADCaAQAACQAQmwEAALICADCcAQEAkAIAIaABAQCQAgAhoQEBAJACACGiAUAAgQIAIaMBQACBAgAhtgEAALMCvAEiuAFAAIECACG5AQEAkQIAIboBAQCRAgAhvAEBAJACACEHBAAAgwQAIAUAAN8DACAGAACCBAAgBwAAhAQAIAgAAIUEACC5AQAAugIAILoBAAC6AgAgEgQAALQCACAFAACiAgAgBgAAsAIAIAcAALUCACAIAAC2AgAgmQEAALICADCaAQAACQAQmwEAALICADCcAQEAAAABoAEBAJACACGhAQEAkAIAIaIBQACBAgAhowFAAIECACG2AQAAswK8ASK4AUAAgQIAIbkBAQCRAgAhugEBAJECACG8AQEAkAIAIQMAAAAJACABAAAKADACAAALACAOAwAAggIAIJkBAAD7AQAwmgEAAA0AEJsBAAD7AQAwnAEBAJACACGfAQEAkAIAIaIBQACBAgAhowFAAIECACGvAQEAkQIAIbABEAD8AQAhsgEAAP0BsgEitAEAAP4BtAEitgEAAP8BtgEitwFAAIACACEBAAAADQAgDgMAAIICACAFAACiAgAgBgAAsAIAIJkBAACxAgAwmgEAAA8AEJsBAACxAgAwnAEBAJACACGdAQIAmwIAIZ4BAQCRAgAhnwEBAJACACGgAQEAkAIAIaEBAQCQAgAhogFAAIECACGjAUAAgQIAIQEAAAAPACADAAAABQAgAQAABgAwAgAABwAgAQAAAAUAIAEAAAAJACADAAAACQAgAQAACgAwAgAACwAgBAMAANYCACAFAADfAwAgBgAAggQAIJ4BAAC6AgAgDgMAAIICACAFAACiAgAgBgAAsAIAIJkBAACxAgAwmgEAAA8AEJsBAACxAgAwnAEBAAAAAZ0BAgCbAgAhngEBAJECACGfAQEAAAABoAEBAJACACGhAQEAkAIAIaIBQACBAgAhowFAAIECACEDAAAADwAgAQAAFQAwAgAAFgAgCwYAALACACCZAQAArwIAMJoBAAAYABCbAQAArwIAMJwBAQCQAgAh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_AQIAAAABwAECAAAAAcEBAQAAAAHCASAAAAABwwEgAAAAAcQBAQAAAAEBFgAAhwEAIAycAQEAAAABoQEBAAAAAaIBQAAAAAGjAUAAAAABvQEBAAAAAb4BAQAAAAG_AQIAAAABwAECAAAAAcEBAQAAAAHCASAAAAABwwEgAAAAAcQBAQAAAAEBFgAAiQEAMAEWAACJAQAwDwYAAPcCACAJAAD2AgAgDAAA-AIAIJwBAQDAAgAhoQEBAMACACGiAUAAwwIAIaMBQADDAgAhvQEBAMACACG-AQEAwgIAIb8BAgDBAgAhwAECAMECACHBAQEAwgIAIcIBIAD0AgAhwwEgAPUCACHEAQEAwAIAIQIAAAAHACAWAACMAQAgDJwBAQDAAgAhoQEBAMACACGiAUAAwwIAIaMBQADDAgAhvQEBAMACACG-AQEAwgIAIb8BAgDBAgAhwAECAMECACHBAQEAwgIAIcIBIAD0AgAhwwEgAPUCACHEAQEAwAIAIQIAAAAFACAWAACOAQAgAgAAAAUAIBYAAI4BACADAAAABwAgHQAAhwEAIB4AAIwBACABAAAABwAgAQAAAAUAIAgLAADvAgAgIwAA8gIAICQAAPECACA1AADwAgAgNgAA8wIAIL4BAAC6AgAgwQEAALoCACDDAQAAugIAIA-ZAQAAhwIAMJoBAACVAQAQmwEAAIcCADCcAQEA3QEAIaEBAQDdAQAhogFAAOABACGjAUAA4AEAIb0BAQDdAQAhvgEBAN8BACG_AQIA3gEAIcABAgDeAQAhwQEBAN8BACHCASAAiAIAIcMBIACJAgAhxAEBAN0BACEDAAAABQAgAQAAlAEAMCIAAJUBACADAAAABQAgAQAABgAwAgAABwAgAQAAAAsAIAEAAAALACADAAAACQAgAQAACgAwAgAACwAgAwAAAAkAIAEAAAoAMAIAAAsAIAMAAAAJACABAAAKADACAAALACAPBAAA6gIAIAUAAOwCACAGAADtAgAgBwAA6wIAIAgAAO4CACCcAQEAAAABoAEBAAAAAaEBAQAAAAGiAUAAAAABowFAAAAAAbYBAAAAvAECuAFAAAAAAbkBAQAAAAG6AQEAAAABvAEBAAAAAQEWAACdAQAgCpwBAQAAAAGgAQEAAAABoQEBAAAAAaIBQAAAAAGjAUAAAAABtgEAAAC8AQK4AUAAAAABuQEBAAAAAboBAQAAAAG8AQEAAAABARYAAJ8BADABFgAAnwEAMA8EAADbAgAgBQAA3QIAIAYAAN4CACAHAADcAgAgCAAA3wIAIJwBAQDAAgAhoAEBAMACACGhAQEAwAIAIaIBQADDAgAhowFAAMMCACG2AQAA2gK8ASK4AUAAwwIAIbkBAQDCAgAhugEBAMICACG8AQEAwAIAIQIAAAALACAWAACiAQAgCpwBAQDAAgAhoAEBAMACACGhAQEAwAIAIaIBQADDAgAhowFAAMMCACG2AQAA2gK8ASK4AUAAwwIAIbkBAQDCAgAhugEBAMICACG8AQEAwAIAIQIAAAAJACAWAACkAQAgAgAAAAkAIBYAAKQBACADAAAACwAgHQAAnQEAIB4AAKIBACABAAAACwAgAQAAAAkAIAULAADXAgAgIwAA2QIAICQAANgCACC5AQAAugIAILoBAAC6AgAgDZkBAACDAgAwmgEAAKsBABCbAQAAgwIAMJwBAQDdAQAhoAEBAN0BACGhAQEA3QEAIaIBQADgAQAhowFAAOABACG2AQAAhAK8ASK4AUAA4AEAIbkBAQDfAQAhugEBAN8BACG8AQEA3QEAIQMAAAAJACABAACqAQAwIgAAqwEAIAMAAAAJACABAAAKADACAAALACAOAwAAggIAIJkBAAD7AQAwmgEAAA0AEJsBAAD7AQAwnAEBAAAAAZ8BAQAAAAGiAUAAgQIAIaMBQACBAgAhrwEBAAAAAbABEAD8AQAhsgEAAP0BsgEitAEAAP4BtAEitgEAAP8BtgEitwFAAIACACEBAAAArgEAIAEAAACuAQAgAwMAANYCACCvAQAAugIAILcBAAC6AgAgAwAAAA0AIAEAALEBADACAACuAQAgAwAAAA0AIAEAALEBADACAACuAQAgAwAAAA0AIAEAALEBADACAACuAQAgCwMAANUCACCcAQEAAAABnwEBAAAAAaIBQAAAAAGjAUAAAAABrwEBAAAAAbABEAAAAAGyAQAAALIBArQBAAAAtAECtgEAAAC2AQK3AUAAAAABARYAALUBACAKnAEBAAAAAZ8BAQAAAAGiAUAAAAABowFAAAAAAa8BAQAAAAGwARAAAAABsgEAAACyAQK0AQAAALQBArYBAAAAtgECtwFAAAAAAQEWAAC3AQAwARYAALcBADALAwAA1AIAIJwBAQDAAgAhnwEBAMACACGiAUAAwwIAIaMBQADDAgAhrwEBAMICACGwARAAzwIAIbIBAADQArIBIrQBAADRArQBIrYBAADSArYBIrcBQADTAgAhAgAAAK4BACAWAAC6AQAgCpwBAQDAAgAhnwEBAMACACGiAUAAwwIAIaMBQADDAgAhrwEBAMICACGwARAAzwIAIbIBAADQArIBIrQBAADRArQBIrYBAADSArYBIrcBQADTAgAhAgAAAA0AIBYAALwBACACAAAADQAgFgAAvAEAIAMAAACuAQAgHQAAtQEAIB4AALoBACABAAAArgEAIAEAAAANACAHCwAAygIAICMAAM0CACAkAADMAgAgNQAAywIAIDYAAM4CACCvAQAAugIAILcBAAC6AgAgDZkBAADrAQAwmgEAAMMBABCbAQAA6wEAMJwBAQDdAQAhnwEBAN0BACGiAUAA4AEAIaMBQADgAQAhrwEBAN8BACGwARAA7AEAIbIBAADtAbIBIrQBAADuAbQBIrYBAADvAbYBIrcBQADwAQAhAwAAAA0AIAEAAMIBADAiAADDAQAgAwAAAA0AIAEAALEBADACAACuAQAgAQAAABYAIAEAAAAWACADAAAADwAgAQAAFQAwAgAAFgAgAwAAAA8AIAEAABUAMAIAABYAIAMAAAAPACABAAAVADACAAAWACALAwAAxwIAIAUAAMgCACAGAADJAgAgnAEBAAAAAZ0BAgAAAAGeAQEAAAABnwEBAAAAAaABAQAAAAGh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_QGyASK0AQAA_gG0ASK2AQAA_wG2ASK3AUAAgAIAIQikARAAAAABpQEQAAAABKYBEAAAAASnARAAAAABqAEQAAAAAakBEAAAAAGqARAAAAABqwEQAPoBACEEpAEAAACyAQKlAQAAALIBCKYBAAAAsgEIqwEAAPgBsgEiBKQBAAAAtAECpQEAAAC0AQimAQAAALQBCKsBAAD2AbQBIgSkAQAAALYBAqUBAAAAtgEIpgEAAAC2AQirAQAA9AG2ASIIpAFAAAAAAaUBQAAAAAWmAUAAAAAFpwFAAAAAAagBQAAAAAGpAUAAAAABqgFAAAAAAasBQADyAQAhCKQBQAAAAAGlAUAAAAAEpgFAAAAABKcBQAAAAAGoAUAAAAABqQFAAAAAAaoBQAAAAAGrAUAA4wEAIRQEAAC0AgAgBQAAogIAIAYAALACACAHAAC1AgAgCAAAtgIAIJkBAACyAgAwmgEAAAkAEJsBAACyAgAwnAEBAJACACGgAQEAkAIAIaEBAQCQAgAhogFAAIECACGjAUAAgQIAIbYBAACzArwBIrgBQACBAgAhuQEBAJECACG6AQEAkQIAIbwBAQCQAgAh5QEAAAkAIOYBAAAJACANmQEAAIMCADCaAQAAqwEAEJsBAACDAgAwnAEBAN0BACGgAQEA3QEAIaEBAQDdAQAhogFAAOABACGjAUAA4AEAIbYBAACEArwBIrgBQADgAQAhuQEBAN8BACG6AQEA3wEAIbwBAQDdAQAhBwsAAOIBACAjAACGAgAgJAAAhgIAIKQBAAAAvAECpQEAAAC8AQimAQAAALwBCKsBAACFArwBIgcLAADiAQAgIwAAhgIAICQAAIYCACCkAQAAALwBAqUBAAAAvAEIpgEAAAC8AQirAQAAhQK8ASIEpAEAAAC8AQKlAQAAALwBCKYBAAAAvAEIqwEAAIYCvAEiD5kBAACHAgAwmgEAAJUBABCbAQAAhwIAMJwBAQDdAQAhoQEBAN0BACGiAUAA4AEAIaMBQADgAQAhvQEBAN0BACG-AQEA3wEAIb8BAgDeAQAhwAECAN4BACHBAQEA3wEAIcIBIACIAgAhwwEgAIkCACHEAQEA3QEAIQULAADiAQAgIwAAjQIAICQAAI0CACCkASAAAAABqwEgAIwCACEFCwAA5QEAICMAAIsCACAkAACLAgAgpAEgAAAAAasBIACKAgAhBQsAAOUBACAjAACLAgAgJAAAiwIAIKQBIAAAAAGrASAAigIAIQKkASAAAAABqwEgAIsCACEFCwAA4gEAICMAAI0CACAkAACNAgAgpAEgAAAAAasBIACMAgAhAqQBIAAAAAGrASAAjQIAIQmZAQAAjgIAMJoBAAB_ABCbAQAAjgIAMJwBAQDdAQAhogFAAOABACGjAUAA4AEAIb4BAQDfAQAhxQEBAN0BACHGAQEA3wEAIQoKAACSAgAgmQEAAI8CADCaAQAAbAAQmwEAAI8CADCcAQEAkAIAIaIBQACBAgAhowFAAIECACG-AQEAkQIAIcUBAQCQAgAhxgEBAJECACELpAEBAAAAAaUBAQAAAASmAQEAAAAEpwEBAAAAAagBAQAAAAGpAQEAAAABqgEBAAAAAasBAQDqAQAhrAEBAAAAAa0BAQAAAAGuAQEAAAABC6QBAQAAAAGlAQEAAAAFpgEBAAAABacBAQAAAAGoAQEAAAABqQEBAAAAAaoBAQAAAAGrAQEA5gEAIawBAQAAAAGtAQEAAAABrgEBAAAAAQPHAQAABQAgyAEAAAUAIMkBAAAFACAKmQEAAJMCADCaAQAAZgAQmwEAAJMCADCcAQEA3QEAIaEBAQDdAQAhogFAAOABACGjAUAA4AEAIcoBAgDeAQAhywEBAN0BACHMAQEA3QEAIRGZAQAAlAIAMJoBAABQABCbAQAAlAIAMJwBAQDdAQAhogFAAOABACGjAUAA4AEAIcIBIACIAgAhzQEBAN8BACHOAQIA3gEAIc8BAgCVAgAh0AEBAN8BACHRAQEA3wEAIdIBAQDfAQAh0wEIAJYCACHUAQIA3gEAIdUBAgDeAQAh1gEBAN0BACENCwAA5QEAICMAAOUBACAkAADlAQAgNQAAmQIAIDYAAOUBACCkAQIAAAABpQECAAAABaYBAgAAAAWnAQIAAAABqAECAAAAAakBAgAAAAGqAQIAAAABqwECAJgCACENCwAA4gEAICMAAOgBACAkAADoAQAgNQAA6AEAIDYAAOgBACCkAQgAAAABpQEIAAAABKYBCAAAAASnAQgAAAABqAEIAAAAAakBCAAAAAGqAQgAAAABqwEIAJcCACENCwAA4gEAICMAAOgBACAkAADoAQAgNQAA6AEAIDYAAOgBACCkAQgAAAABpQEIAAAABKYBCAAAAASnAQgAAAABqAEIAAAAAakBCAAAAAGqAQgAAAABqwEIAJcCACENCwAA5QEAICMAAOUBACAkAADlAQAgNQAAmQIAIDYAAOUBACCkAQIAAAABpQECAAAABaYBAgAAAAWnAQIAAAABqAECAAAAAakBAgAAAAGqAQIAAAABqwECAJgCACEIpAEIAAAAAaUBCAAAAAWmAQgAAAAFpwEIAAAAAagBCAAAAAGpAQgAAAABqgEIAAAAAasBCACZAgAhFgkAAJ8CACAKAACSAgAgDQAAoAIAIA4AAKECACAPAACiAgAgmQEAAJoCADCaAQAAAwAQmwEAAJoCADCcAQEAkAIAIaIBQACBAgAhowFAAIECACHCASAAngIAIc0BAQCRAgAhzgECAJsCACHPAQIAnAIAIdABAQCRAgAh0QEBAJECACHSAQEAkQIAIdMBCACdAgAh1AECAJsCACHVAQIAmwIAIdYBAQCQAgAhCKQBAgAAAAGlAQIAAAAEpgECAAAABKcBAgAAAAGoAQIAAAABqQECAAAAAaoBAgAAAAGrAQIA4gEAIQikAQIAAAABpQECAAAABaYBAgAAAAWnAQIAAAABqAECAAAAAakBAgAAAAGqAQIAAAABqwECAOUBACEIpAEIAAAAAaUBCAAAAASmAQgAAAAEpwEIAAAAAagBCAAAAAGpAQgAAAABqgEIAAAAAasBCADoAQAhAqQBIAAAAAGrASAAjQIAIQPHAQAACQAgyAEAAAkAIMkBAAAJACADxwEAAA8AIMgBAAAPACDJAQAADwAgA8cBAAAYACDIAQAAGAAgyQEAABgAIBgGAACtAgAgDQAAoAIAIBAAAJ8CACCZAQAAqgIAMJoBAAAlABCbAQAAqgIAMJwBAQCQAgAhogFAAIECACGjAUAAgQIAIbYBAACsAuIBIsUBAQCQAgAh1wEBAJACACHYAQEAkAIAIdkBAQCRAgAh2gEBAJECACHbAQEAkQIAIdwBAQCRAgAh3QEBAJECACHeAQEAkQIAIeABAACrAuABIuIBIACeAgAh4wEgAJ4CACHlAQAAJQAg5gEAACUAIBOZAQAAowIAMJoBAAA4ABCbAQAAowIAMJwBAQDdAQAhogFAAOABACGjAUAA4AEAIbYBAAClAuIBIsUBAQDdAQAh1wEBAN0BACHYAQEA3QEAIdkBAQDfAQAh2gEBAN8BACHbAQEA3wEAIdwBAQDfAQAh3QEBAN8BACHeAQEA3wEAIeABAACkAuABIuIBIACIAgAh4wEgAIgCACEHCwAA4gEAICMAAKkCACAkAACpAgAgpAEAAADgAQKlAQAAAOABCKYBAAAA4AEIqwEAAKgC4AEiBwsAAOIBACAjAACnAgAgJAAApwIAIKQBAAAA4gECpQEAAADiAQimAQAAAOIBCKsBAACmAuIBIgcLAADiAQAgIwAApwIAICQAAKcCACCkAQAAAOIBAqUBAAAA4gEIpgEAAADiAQirAQAApgLiASIEpAEAAADiAQKlAQAAAOIBCKYBAAAA4gEIqwEAAKcC4gEiBwsAAOIBACAjAACpAgAgJAAAqQIAIKQBAAAA4AECpQEAAADgAQimAQAAAOABCKsBAACoAuABIgSkAQAAAOABAqUBAAAA4AEIpgEAAADgAQirAQAAqQLgASIWBgAArQIAIA0AAKACACAQAACfAgAgmQEAAKoCADCaAQAAJQAQmwEAAKoCADCcAQEAkAIAIaIBQACBAgAhowFAAIECACG2AQAArALiASLFAQEAkAIAIdcBAQCQAgAh2AEBAJACACHZAQEAkQIAIdoBAQCRAgAh2wEBAJECACHcAQEAkQIAId0BAQCRAgAh3gEBAJECACHgAQAAqwLgASLiASAAngIAIeMBIACeAgAhBKQBAAAA4AECpQEAAADgAQimAQAAAOABCKsBAACpAuABIgSkAQAAAOIBAqUBAAAA4gEIpgEAAADiAQirAQAApwLiASIYCQAAnwIAIAoAAJICACANAACgAgAgDgAAoQIAIA8AAKICACCZAQAAmgIAMJoBAAADABCbAQAAmgIAMJwBAQCQAgAhogFAAIECACGjAUAAgQIAIcIBIACeAgAhzQEBAJECACHOAQIAmwIAIc8BAgCcAgAh0AEBAJECACHRAQEAkQIAIdIBAQCRAgAh0wEIAJ0CACHUAQIAmwIAIdUBAgCbAgAh1gEBAJACACHlAQAAAwAg5gEAAAMAIAShAQEAAAABygECAAAAAcsBAQAAAAHMAQEAAAABCwYAALACACCZAQAArwIAMJoBAAAYABCbAQAArwIAMJwBAQCQAgAhoQEBAJACACGiAUAAgQIAIaMBQACBAgAhygECAJsCACHLAQEAkAIAIcwBAQCQAgAhGAkAAJ8CACAKAACSAgAgDQAAoAIAIA4AAKECACAPAACiAgAgmQEAAJoCADCaAQAAAwAQmwEAAJoCADCcAQEAkAIAIaIBQACBAgAhowFAAIECACHCASAAngIAIc0BAQCRAgAhzgECAJsCACHPAQIAnAIAIdABAQCRAgAh0QEBAJECACHSAQEAkQIAIdMBCACdAgAh1AECAJsCACHVAQIAmwIAIdYBAQCQAgAh5QEAAAMAIOYBAAADACAOAwAAggIAIAUAAKICACAGAACwAgAgmQEAALECADCaAQAADwAQmwEAALECADCcAQEAkAIAIZ0BAgCbAgAhngEBAJECACGfAQEAkAIAIaABAQCQAgAhoQEBAJACACGiAUAAgQIAIaMBQACBAgAhEgQAALQCACAFAACiAgAgBgAAsAIAIAcAALUCACAIAAC2AgAgmQEAALICADCaAQAACQAQmwEAALICADCcAQEAkAIAIaABAQCQAgAhoQEBAJACACGiAUAAgQIAIaMBQACBAgAhtgEAALMCvAEiuAFAAIECACG5AQEAkQIAIboBAQCRAgAhvAEBAJACACEEpAEAAAC8AQKlAQAAALwBCKYBAAAAvAEIqwEAAIYCvAEiEAMAAIICACCZAQAA-wEAMJoBAAANABCbAQAA-wEAMJwBAQCQAgAhnwEBAJACACGiAUAAgQIAIaMBQACBAgAhrwEBAJECACGwARAA_AEAIbIBAAD9AbIBIrQBAAD-AbQBIrYBAAD_AbYBIrcBQACAAgAh5QEAAA0AIOYBAAANACAQAwAAggIAIAUAAKICACAGAACwAgAgmQEAALECADCaAQAADwAQmwEAALECADCcAQEAkAIAIZ0BAgCbAgAhngEBAJECACGfAQEAkAIAIaABAQCQAgAhoQEBAJACACGiAUAAgQIAIaMBQACBAgAh5QEAAA8AIOYBAAAPACAUBgAAsAIAIAkAAJ8CACAMAAC5AgAgmQEAALcCADCaAQAABQAQmwEAALcCADCcAQEAkAIAIaEBAQCQAgAhogFAAIECACGjAUAAgQIAIb0BAQCQAgAhvgEBAJECACG_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_gIAMOcBAAD6AgAw6AEAAPsCADDpAQAA_QIAMOoBAAD9AgAw6wEAAP0CADDsAQAA_AIAIO0BAAD9AgAw7gEAAP8CADDvAQAAgAMAMAUdAACaBAAgHgAAoQQAIOcBAACbBAAg6AEAAKAEACDrAQAAOwAgBR0AAJgEACAeAACeBAAg5wEAAJkEACDoAQAAnQQAIOsBAABpACANBAAA6gIAIAUAAOwCACAGAADtAgAgBwAA6wIAIJwBAQAAAAGgAQEAAAABoQEBAAAAAaIBQAAAAAGjAUAAAAABtgEAAAC8AQK4AUAAAAABuQEBAAAAAboBAQAAAAECAAAACwAgHQAAhAMAIAMAAAALACAdAACEAwAgHgAAgwMAIAEWAACcBAAwEgQAALQCACAFAACiAgAgBgAAsAIAIAcAALUCACAIAAC2AgAgmQEAALICADCaAQAACQAQmwEAALICADCcAQEAAAABoAEBAJACACGhAQEAkAIAIaIBQACBAgAhowFAAIECACG2AQAAswK8ASK4AUAAgQIAIbkBAQCRAgAhugEBAJECACG8AQEAkAIAIQIAAAALACAWAACDAwAgAgAAAIEDACAWAACCAwAgDZkBAACAAwAwmgEAAIEDABCbAQAAgAMAMJwBAQCQAgAhoAEBAJACACGhAQEAkAIAIaIBQACBAgAhowFAAIECACG2AQAAswK8ASK4AUAAgQIAIbkBAQCRAgAhugEBAJECACG8AQEAkAIAIQ2ZAQAAgAMAMJoBAACBAwAQmwEAAIADADCcAQEAkAIAIaABAQCQAgAhoQEBAJACACGiAUAAgQIAIaMBQACBAgAhtgEAALMCvAEiuAFAAIECACG5AQEAkQIAIboBAQCRAgAhvAEBAJACACEJnAEBAMACACGgAQEAwAIAIaEBAQDAAgAhogFAAMMCACGjAUAAwwIAIbYBAADaArwBIrgBQADDAgAhuQEBAMICACG6AQEAwgIAIQ0EAADbAgAgBQAA3QIAIAYAAN4CACAHAADcAgAgnAEBAMACACGgAQEAwAIAIaEBAQDAAgAhogFAAMMCACGjAUAAwwIAIbYBAADaArwBIrgBQADDAgAhuQEBAMICACG6AQEAwgIAIQ0EAADqAgAgBQAA7AIAIAYAAO0CACAHAADrAgAgnAEBAAAAAaABAQAAAAGhAQEAAAABogFAAAAAAaMBQAAAAAG2AQAAALwBArgBQAAAAAG5AQEAAAABugEBAAAAAQQdAAD5AgAw5wEAAPoCADDrAQAA_QIAMOwBAAD8AgAgAx0AAJoEACDnAQAAmwQAIOsBAAA7ACADHQAAmAQAIOcBAACZBAAg6wEAAGkAIAAAAAsdAACMAwAwHgAAkQMAMOcBAACNAwAw6AEAAI4DADDpAQAAkAMAMOoBAACQAwAw6wEAAJADADDsAQAAjwMAIO0BAACQAwAw7gEAAJIDADDvAQAAkwMAMA0GAACGAwAgCQAAhQMAIJwBAQAAAAGhAQEAAAABogFAAAAAAaMBQAAAAAG9AQEAAAABvgEBAAAAAb8BAgAAAAHAAQIAAAABwQEBAAAAAcIBIAAAAAHDASAAAAABAgAAAAcAIB0AAJcDACADAAAABwAgHQAAlwMAIB4AAJYDACABFgAAlwQAMBIGAACwAgAgCQAAnwIAIAwAALkCACCZAQAAtwIAMJoBAAAFABCbAQAAtwIAMJwBAQAAAAGhAQEAkAIAIaIBQACBAgAhowFAAIECACG9AQEAkAIAIb4BAQCRAgAhvwECAJsCACHAAQIAmwIAIcEBAQCRAgAhwgEgAJ4CACHDASAAuAIAIcQBAQCQAgAhAgAAAAcAIBYAAJYDACACAAAAlAMAIBYAAJUDACAPmQEAAJMDADCaAQAAlAMAEJsBAACTAwAwnAEBAJACACGhAQEAkAIAIaIBQACBAgAhowFAAIECACG9AQEAkAIAIb4BAQCRAgAhvwECAJsCACHAAQIAmwIAIcEBAQCRAgAhwgEgAJ4CACHDASAAuAIAIcQBAQCQAgAhD5kBAACTAwAwmgEAAJQDABCbAQAAkwMAMJwBAQCQAgAhoQEBAJACACGiAUAAgQIAIaMBQACBAgAhvQEBAJACACG-AQEAkQIAIb8BAgCbAgAhwAECAJsCACHBAQEAkQIAIcIBIACeAgAhwwEgALgCACHEAQEAkAIAIQucAQEAwAIAIaEBAQDAAgAhogFAAMMCACGjAUAAwwIAIb0BAQDAAgAhvgEBAMICACG_AQIAwQIAIcABAgDBAgAhwQEBAMICACHCASAA9AIAIcMBIAD1AgAhDQYAAPcCACAJAAD2AgAgnAEBAMACACGhAQEAwAIAIaIBQADDAgAhowFAAMMCACG9AQEAwAIAIb4BAQDCAgAhvwECAMECACHAAQIAwQIAIcEBAQDCAgAhwgEgAPQCACHDASAA9QIAIQ0GAACGAwAgCQAAhQMAIJwBAQAAAAGhAQEAAAABogFAAAAAAaMBQAAAAAG9AQEAAAABvgEBAAAAAb8BAgAAAAHAAQIAAAABwQEBAAAAAcIBIAAAAAHDASAAAAABBB0AAIwDADDnAQAAjQMAMOsBAACQAwAw7AEAAI8DACAAAAAAAAAFHQAAkgQAIB4AAJUEACDnAQAAkwQAIOgBAACUBAAg6wEAADsAIAMdAACSBAAg5wEAAJMEACDrAQAAOwAgAAAAAAAF7QECAAAAAfABAgAAAAHxAQIAAAAB8gECAAAAAfMBAgAAAAEF7QEIAAAAAfABCAAAAAHxAQgAAAAB8gEIAAAAAfMBCAAAAAELHQAAzgMAMB4AANIDADDnAQAAzwMAMOgBAADQAwAw6QEAAJADADDqAQAAkAMAMOsBAACQAwAw7AEAANEDACDtAQAAkAMAMO4BAADTAwAw7wEAAJMDADALHQAAxQMAMB4AAMkDADDnAQAAxgMAMOgBAADHAwAw6QEAAP0CADDqAQAA_QIAMOsBAAD9AgAw7AEAAMgDACDtAQAA_QIAMO4BAADKAwAw7wEAAIADADALHQAAuQMAMB4AAL4DADDnAQAAugMAMOgBAAC7AwAw6QEAAL0DADDqAQAAvQMAMOsBAAC9AwAw7AEAALwDACDtAQAAvQMAMO4BAAC_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_AQIAAAABwAECAAAAAcEBAQAAAAHCASAAAAABwwEgAAAAAcQBAQAAAAECAAAABwAgHQAA1gMAIAMAAAAHACAdAADWAwAgHgAA1QMAIAEWAACLBAAwAgAAAAcAIBYAANUDACACAAAAlAMAIBYAANQDACALnAEBAMACACGiAUAAwwIAIaMBQADDAgAhvQEBAMACACG-AQEAwgIAIb8BAgDBAgAhwAECAMECACHBAQEAwgIAIcIBIAD0AgAhwwEgAPUCACHEAQEAwAIAIQ0JAAD2AgAgDAAA-AIAIJwBAQDAAgAhogFAAMMCACGjAUAAwwIAIb0BAQDAAgAhvgEBAMICACG_AQIAwQIAIcABAgDBAgAhwQEBAMICACHCASAA9AIAIcMBIAD1AgAhxAEBAMACACENCQAAhQMAIAwAAIcDACCcAQEAAAABogFAAAAAAaMBQAAAAAG9AQEAAAABvgEBAAAAAb8BAgAAAAHAAQIAAAABwQEBAAAAAcIBIAAAAAHDASAAAAABxAEBAAAAAQQdAADOAwAw5wEAAM8DADDrAQAAkAMAMOwBAADRAwAgBB0AAMUDADDnAQAAxgMAMOsBAAD9AgAw7AEAAMgDACAEHQAAuQMAMOcBAAC6AwAw6wEAAL0DADDsAQAAvAMAIAQdAACtAwAw5wEAAK4DADDrAQAAsQMAMOwBAACwAwAgAx0AAIkEACDnAQAAigQAIOsBAAABACAAAAAJBgAAggQAIA0AAN0DACAQAADcAwAg2QEAALoCACDaAQAAugIAINsBAAC6AgAg3AEAALoCACDdAQAAugIAIN4BAAC6AgAgAAAAAe0BAAAA4AECAe0BAAAA4gECBx0AAPoDACAeAAD9AwAg5wEAAPsDACDoAQAA_AMAIOkBAAADACDqAQAAAwAg6wEAADsAIAsdAADxAwAwHgAA9QMAMOcBAADyAwAw6AEAAPMDADDpAQAA_QIAMOoBAAD9AgAw6wEAAP0CADDsAQAA9AMAIO0BAAD9AgAw7gEAAPYDADDvAQAAgAMAMAsdAADoAwAwHgAA7AMAMOcBAADpAwAw6AEAAOoDADDpAQAAvQMAMOoBAAC9AwAw6wEAAL0DADDsAQAA6wMAIO0BAAC9AwAw7gEAAO0DADDvAQAAwAMAMAkDAADHAgAgBgAAyQIAIJwBAQAAAAGdAQIAAAABngEBAAAAAZ8BAQAAAAGhAQEAAAABogFAAAAAAaMBQAAAAAECAAAAFgAgHQAA8AMAIAMAAAAWACAdAADwAwAgHgAA7wMAIAEWAACIBAAwAgAAABYAIBYAAO8DACACAAAAwQMAIBYAAO4DACAHnAEBAMACACGdAQIAwQIAIZ4BAQDCAgAhnwEBAMACACGhAQEAwAIAIaIBQADDAgAhowFAAMMCACEJAwAAxAIAIAYAAMYCACCcAQEAwAIAIZ0BAgDBAgAhngEBAMICACGfAQEAwAIAIaEBAQDAAgAhogFAAMMCACGjAUAAwwIAIQkDAADHAgAgBgAAyQIAIJwBAQAAAAGdAQIAAAABngEBAAAAAZ8BAQAAAAGhAQEAAAABogFAAAAAAaMBQAAAAAENBAAA6gIAIAYAAO0CACAHAADrAgAgCAAA7gIAIJwBAQAAAAGhAQEAAAABogFAAAAAAaMBQAAAAAG2AQAAALwBArgBQAAAAAG5AQEAAAABugEBAAAAAbwBAQAAAAECAAAACwAgHQAA-QMAIAMAAAALACAdAAD5AwAgHgAA-AMAIAEWAACHBAAwAgAAAAsAIBYAAPgDACACAAAAgQMAIBYAAPcDACAJnAEBAMACACGhAQEAwAIAIaIBQADDAgAhowFAAMMCACG2AQAA2gK8ASK4AUAAwwIAIbkBAQDCAgAhugEBAMICACG8AQEAwAIAIQ0EAADbAgAgBgAA3gIAIAcAANwCACAIAADfAgAgnAEBAMACACGhAQEAwAIAIaIBQADDAgAhowFAAMMCACG2AQAA2gK8ASK4AUAAwwIAIbkBAQDCAgAhugEBAMICACG8AQEAwAIAIQ0EAADqAgAgBgAA7QIAIAcAAOsCACAIAADuAgAgnAEBAAAAAaEBAQAAAAGiAUAAAAABowFAAAAAAbYBAAAAvAECuAFAAAAAAbkBAQAAAAG6AQEAAAABvAEBAAAAAREJAADYAwAgCgAA1wMAIA0AANkDACAOAADaAwAgnAEBAAAAAaIBQAAAAAGjAUAAAAABwgEgAAAAAc0BAQAAAAHOAQIAAAABzwECAAAAAdABAQAAAAHRAQEAAAAB0gEBAAAAAdMBCAAAAAHUAQIAAAAB1QECAAAAAQIAAAA7ACAdAAD6AwAgAwAAAAMAIB0AAPoDACAeAAD-AwAgEwAAAAMAIAkAAKkDACAKAACoAwAgDQAAqgMAIA4AAKsDACAWAAD-AwAgnAEBAMACACGiAUAAwwIAIaMBQADDAgAhwgEgAPQCACHNAQEAwgIAIc4BAgDBAgAhzwECAKYDACHQAQEAwgIAIdEBAQDCAgAh0gEBAMICACHTAQgApwMAIdQBAgDBAgAh1QECAMECACERCQAAqQMAIAoAAKgDACANAACqAwAgDgAAqwMAIJwBAQDAAgAhogFAAMMCACGjAUAAwwIAIcIBIAD0AgAhzQEBAMICACHOAQIAwQIAIc8BAgCmAwAh0AEBAMICACHRAQEAwgIAIdIBAQDCAgAh0wEIAKcDACHUAQIAwQIAIdUBAgDBAgAhAx0AAPoDACDnAQAA-wMAIOsBAAA7ACAEHQAA8QMAMOcBAADyAwAw6wEAAP0CADDsAQAA9AMAIAQdAADoAwAw5wEAAOkDADDrAQAAvQMAMOwBAADrAwAgCgkAANwDACAKAACZAwAgDQAA3QMAIA4AAN4DACAPAADfAwAgzQEAALoCACDPAQAAugIAINABAAC6AgAg0QEAALoCACDSAQAAugIAIAMDAADWAgAgrwEAALoCACC3AQAAugIAIAQDAADWAgAgBQAA3wMAIAYAAIIEACCeAQAAugIAIAYGAACCBAAgCQAA3AMAIAwAAIYEACC-AQAAugIAIMEBAAC6AgAgwwEAALoCACADCgAAmQMAIL4BAAC6AgAgxgEAALoCACAJnAEBAAAAAaEBAQAAAAGiAUAAAAABowFAAAAAAbYBAAAAvAECuAFAAAAAAbkBAQAAAAG6AQEAAAABvAEBAAAAAQecAQEAAAABnQECAAAAAZ4BAQAAAAGfAQEAAAABoQEBAAAAAaIBQAAAAAGjAUAAAAABEg0AAIEEACAQAACABAAgnAEBAAAAAaIBQAAAAAGjAUAAAAABtgEAAADiAQLFAQEAAAAB1wEBAAAAAdgBAQAAAAHZAQEAAAAB2gEBAAAAAdsBAQAAAAHcAQEAAAAB3QEBAAAAAd4BAQAAAAHgAQAAAOABAuIBIAAAAAHjASAAAAABAgAAAAEAIB0AAIkEACALnAEBAAAAAaIBQAAAAAGjAUAAAAABvQEBAAAAAb4BAQAAAAG_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_AQIAAAABwAECAAAAAcEBAQAAAAHCASAAAAABwwEgAAAAAcQBAQAAAAECAAAABwAgHQAAowQAIBIKAADXAwAgDQAA2QMAIA4AANoDACAPAADbAwAgnAEBAAAAAaIBQAAAAAGjAUAAAAABwgEgAAAAAc0BAQAAAAHOAQIAAAABzwECAAAAAdABAQAAAAHRAQEAAAAB0gEBAAAAAdMBCAAAAAHUAQIAAAAB1QECAAAAAdYBAQAAAAECAAAAOwAgHQAApQQAIBIGAAD_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_AwAgEAAAgAQAIJwBAQAAAAGiAUAAAAABowFAAAAAAbYBAAAA4gECxQEBAAAAAdcBAQAAAAHYAQEAAAAB2QEBAAAAAdoBAQAAAAHbAQEAAAAB3AEBAAAAAd0BAQAAAAHeAQEAAAAB4AEAAADgAQLiASAAAAAB4wEgAAAAAQIAAAABACAdAAC5BAAgDgQAAOoCACAFAADsAgAgBgAA7QIAIAgAAO4CACCcAQEAAAABoAEBAAAAAaEBAQAAAAGiAUAAAAABowFAAAAAAbYBAAAAvAECuAFAAAAAAbkBAQAAAAG6AQEAAAABvAEBAAAAAQIAAAALACAdAAC7BAAgAwAAAAMAIB0AALcEACAeAAC_BAAgFAAAAAMAIAkAAKkDACAKAACoAwAgDgAAqwMAIA8AAKwDACAWAAC_BAAgnAEBAMACACGiAUAAwwIAIaMBQADDAgAhwgEgAPQCACHNAQEAwgIAIc4BAgDBAgAhzwECAKYDACHQAQEAwgIAIdEBAQDCAgAh0gEBAMICACHTAQgApwMAIdQBAgDBAgAh1QECAMECACHWAQEAwAIAIRIJAACpAwAgCgAAqAMAIA4AAKsDACAPAACsAwAgnAEBAMACACGiAUAAwwIAIaMBQADDAgAhwgEgAPQCACHNAQEAwgIAIc4BAgDBAgAhzwECAKYDACHQAQEAwgIAIdEBAQDCAgAh0gEBAMICACHTAQgApwMAIdQBAgDBAgAh1QECAMECACHWAQEAwAIAIQMAAAAlACAdAAC5BAAgHgAAwgQAIBQAAAAlACAGAADlAwAgEAAA5gMAIBYAAMIEACCcAQEAwAIAIaIBQADDAgAhowFAAMMCACG2AQAA5APiASLFAQEAwAIAIdcBAQDAAgAh2AEBAMACACHZAQEAwgIAIdoBAQDCAgAh2wEBAMICACHcAQEAwgIAId0BAQDCAgAh3gEBAMICACHgAQAA4wPgASLiASAA9AIAIeMBIAD0AgAhEgYAAOUDACAQAADmAwAgnAEBAMACACGiAUAAwwIAIaMBQADDAgAhtgEAAOQD4gEixQEBAMACACHXAQEAwAIAIdgBAQDAAgAh2QEBAMICACHaAQEAwgIAIdsBAQDCAgAh3AEBAMICACHdAQEAwgIAId4BAQDCAgAh4AEAAOMD4AEi4gEgAPQCACHjASAA9AIAIQMAAAAJACAdAAC7BAAgHgAAxQQAIBAAAAAJACAEAADbAgAgBQAA3QIAIAYAAN4CACAIAADfAgAgFgAAxQQAIJwBAQDAAgAhoAEBAMACACGhAQEAwAIAIaIBQADDAgAhowFAAMMCACG2AQAA2gK8ASK4AUAAwwIAIbkBAQDCAgAhugEBAMICACG8AQEAwAIAIQ4EAADbAgAgBQAA3QIAIAYAAN4CACAIAADfAgAgnAEBAMACACGgAQEAwAIAIaEBAQDAAgAhogFAAMMCACGjAUAAwwIAIbYBAADaArwBIrgBQADDAgAhuQEBAMICACG6AQEAwgIAIbwBAQDAAgAhBAYEAgsADA0hBhAgBAYJFAQKCAMLAAsNFwYOGwoPAAEEBgACCQwECwAJDAAHBQQOBQUAAQYAAgcQBggAAwEDAAQDAwAEBQABBgACAgoRAwsACAEKEgABCRMAAQYAAgQJHQAKHAANHgAOHwACDSMAECIAAAAAAwsAESMAEiQAEwAAAAMLABEjABIkABMBDwABAQ8AAQULABgjABskABw1ABk2ABoAAAAAAAULABgjABskABw1ABk2ABoBBgACAQYAAgULACEjACQkACU1ACI2ACMAAAAAAAULACEjACQkACU1ACI2ACMAAAMLACojACskACwAAAADCwAqIwArJAAsAgYAAgwABwIGAAIMAAcFCwAxIwA0JAA1NQAyNgAzAAAAAAAFCwAxIwA0JAA1NQAyNgAzAwUAAQYAAggAAwMFAAEGAAIIAAMDCwA6IwA7JAA8AAAAAwsAOiMAOyQAPAEDAAQBAwAEBQsAQSMARCQARTUAQjYAQwAAAAAABQsAQSMARCQARTUAQjYAQwMDAAQFAAEGAAIDAwAEBQABBgACBQsASiMATSQATjUASzYATAAAAAAABQsASiMATSQATjUASzYATBECARIkARMnARQoARUpARcrARgtDRkuDhowARsyDRwzDx80ASA1ASE2DSU5ECY6FCc8Aig9Aik_AipAAitBAixDAi1FDS5GFS9IAjBKDTFLFjJMAjNNAjRODTdRFzhSHTlTCjpUCjtVCjxWCj1XCj5ZCj9bDUBcHkFeCkJgDUNhH0RiCkVjCkZkDUdnIEhoJklqB0prB0tuB0xvB01wB05yB090DVB1J1F3B1J5DVN6KFR7B1V8B1Z9DVeAASlYgQEtWYIBA1qDAQNbhAEDXIUBA12GAQNeiAEDX4oBDWCLAS5hjQEDYo8BDWOQAS9kkQEDZZIBA2aTAQ1nlgEwaJcBNmmYAQRqmQEEa5oBBGybAQRtnAEEbp4BBG-gAQ1woQE3caMBBHKlAQ1zpgE4dKcBBHWoAQR2qQENd6wBOXitAT15rwEFerABBXuyAQV8swEFfbQBBX62AQV_uAENgAG5AT6BAbsBBYIBvQENgwG-AT-EAb8BBYUBwAEFhgHBAQ2HAcQBQIgBxQFGiQHGAQaKAccBBosByAEGjAHJAQaNAcoBBo4BzAEGjwHOAQ2QAc8BR5EB0QEGkgHTAQ2TAdQBSJQB1QEGlQHWAQaWAdcBDZcB2gFJmAHbAU8"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  AvailabilitySlotScalarFieldEnum: () => AvailabilitySlotScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  ServiceScalarFieldEnum: () => ServiceScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TechnicianProfileScalarFieldEnum: () => TechnicianProfileScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UsersScalarFieldEnum: () => UsersScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.8.0",
  engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Users: "Users",
  TechnicianProfile: "TechnicianProfile",
  AvailabilitySlot: "AvailabilitySlot",
  Category: "Category",
  Service: "Service",
  Booking: "Booking",
  Payment: "Payment",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UsersScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  phone: "phone",
  profileImage: "profileImage",
  address: "address",
  city: "city",
  district: "district",
  postalCode: "postalCode",
  role: "role",
  status: "status",
  isVerified: "isVerified",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TechnicianProfileScalarFieldEnum = {
  id: "id",
  bio: "bio",
  experience: "experience",
  hourlyRate: "hourlyRate",
  skills: "skills",
  nationalId: "nationalId",
  certification: "certification",
  averageRating: "averageRating",
  totalReviews: "totalReviews",
  completedJobs: "completedJobs",
  isAvailable: "isAvailable",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AvailabilitySlotScalarFieldEnum = {
  id: "id",
  technicianId: "technicianId",
  dayOfWeek: "dayOfWeek",
  startTime: "startTime",
  endTime: "endTime",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  icon: "icon",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ServiceScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  price: "price",
  duration: "duration",
  serviceArea: "serviceArea",
  isAvailable: "isAvailable",
  featured: "featured",
  technicianId: "technicianId",
  categoryId: "categoryId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BookingScalarFieldEnum = {
  id: "id",
  bookingDate: "bookingDate",
  bookingTime: "bookingTime",
  note: "note",
  status: "status",
  customerId: "customerId",
  technicianId: "technicianId",
  serviceId: "serviceId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  transactionId: "transactionId",
  amount: "amount",
  provider: "provider",
  method: "method",
  status: "status",
  paidAt: "paidAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  bookingId: "bookingId",
  customerId: "customerId",
  technicianId: "technicianId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var UserRole = {
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
  ADMIN: "ADMIN"
};
var BookingStatus = {
  REQUESTED: "REQUESTED",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  PAID: "PAID",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/middlewares/global-error.ts
var globalErrorHandler = (err, req, res, next) => {
  console.log("Error : ", err);
  let statusCode;
  let errorMessage = err.message || "Internal Server Error";
  let errorName = err.name || "Internal Server Error";
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = httpStatus2.BAD_REQUEST;
    errorMessage = "You have provided incorrect field type or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus2.BAD_REQUEST, errorMessage = "Duplicate Key Error";
    } else if (err.code === "P2003") {
      statusCode = httpStatus2.BAD_REQUEST, errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      statusCode = httpStatus2.BAD_REQUEST, errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus2.UNAUTHORIZED;
      errorMessage = "Authentication failed against database server. Please Check Your Credentials";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus2.BAD_REQUEST;
      errorMessage = "Can't reach database server";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = httpStatus2.INTERNAL_SERVER_ERROR;
    errorMessage = "Error occurred during query execution";
  }
  res.status(httpStatus2.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: statusCode || httpStatus2.INTERNAL_SERVER_ERROR,
    name: errorName,
    message: errorMessage,
    error: err.stack
  });
};

// src/modules/user/user.route.ts
import { Router } from "express";

// src/modules/user/user.controller.ts
import httpStatus3 from "http-status";

// src/utils/catch-async.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/utils/send-response.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data
  });
};

// src/modules/user/user.service.ts
import bcrypt from "bcryptjs";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/modules/user/user.service.ts
var registerUserIntoDB = async (payload) => {
  const { name, email, password, phone, profileImage } = payload;
  const isUserExist = await prisma.users.findUnique({
    where: { email }
  });
  if (isUserExist) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config_default.bcrypt_salt_rounds)
  );
  const createdUser = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      profileImage
    }
  });
  const user = await prisma.users.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email
    },
    omit: {
      password: true
    }
  });
  return user;
};
var getMyProfileFromDB = async (userId) => {
  const user = await prisma.users.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true
    }
  });
  return user;
};
var userService = {
  registerUserIntoDB,
  getMyProfileFromDB
};

// src/modules/user/user.controller.ts
var registerUser = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const payload = req.body;
  const user = await userService.registerUserIntoDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus3.CREATED,
    message: "User registered successfully",
    data: { user }
  });
});
var getMyProfile = catchAsync(async (req, res, next) => {
  const profile = await userService.getMyProfileFromDB(req.users?.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus3.OK,
    message: "User profile fetched successfully",
    data: { profile }
  });
});
var userController = {
  registerUser,
  getMyProfile
};

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(
    payload,
    secret,
    {
      expiresIn
    }
  );
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken
    };
  } catch (error) {
    console.log("Token verification failed:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/middlewares/auth.ts
var auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.cookies.accessToken ?? (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : req.headers.authorization);
    if (!token) {
      throw new Error("You are not logged in. Please log in to access this resource.");
    }
    const verifiedToken = jwtUtils.verifyToken(
      token,
      config_default.jwt_access_secret
    );
    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }
    const { id, email, name, role } = verifiedToken.data;
    const user = await prisma.users.findUnique({
      where: {
        id
      }
    });
    if (!user) {
      throw new Error("User not found. Please log in again.");
    }
    if (user.email !== email || user.name !== name || user.role !== role) {
      throw new Error("Invalid token.");
    }
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      throw new Error("Forbidden. You don't have permission to access this resource.");
    }
    req.users = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    next();
  });
};

// src/modules/user/user.route.ts
var router = Router();
router.post("/register", userController.registerUser);
router.get("/me", auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.TECHNICIAN), userController.getMyProfile);
var userRoutes = router;

// src/modules/auth/auth.routes.ts
import { Router as Router2 } from "express";

// src/modules/auth/auth.controller.ts
import httpStatus4 from "http-status";

// src/modules/auth/auth.service.ts
import bcrypt2 from "bcryptjs";
var loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.users.findUniqueOrThrow({
    where: { email }
  });
  if (user.status === "BLOCKED") {
    throw new Error("Your account has been blocked. Please contact support.");
  }
  const isPasswordMatched = await bcrypt2.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var refreshToken = async (refreshToken3) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken3, config_default.jwt_refresh_secret);
  if (!verifiedRefreshToken.success) {
    throw new Error(verifiedRefreshToken.error);
  }
  const { id } = verifiedRefreshToken.data;
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      id
    }
  });
  if (user.status === "BLOCKED") {
    throw new Error("User is blocked!");
  }
  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  return { accessToken };
};
var authService = {
  loginUser,
  refreshToken
};

// src/modules/auth/auth.controller.ts
var loginUser2 = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const { accessToken, refreshToken: refreshToken3 } = await authService.loginUser(payload);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 day
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "User logged in successfully",
    data: { accessToken, refreshToken: refreshToken3 }
  });
});
var refreshToken2 = catchAsync(async (req, res, next) => {
  const refreshToken3 = req.cookies.refreshToken;
  const { accessToken } = await authService.refreshToken(refreshToken3);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "Token Refreshed Successfully",
    data: {
      accessToken
    }
  });
});
var authController = {
  loginUser: loginUser2,
  refreshToken: refreshToken2
};

// src/modules/auth/auth.routes.ts
var router2 = Router2();
router2.post("/login", authController.loginUser);
router2.post("/refresh-token", authController.refreshToken);
var authRoutes = router2;

// src/modules/technicians/technician.route.ts
import { Router as Router3 } from "express";

// src/modules/technicians/technician.controller.ts
import httpStatus5 from "http-status";

// src/modules/technicians/technician.service.ts
var createTechnician = async (userId, payload) => {
  await prisma.users.findUniqueOrThrow({
    where: {
      id: userId
    }
  });
  const existingProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId
    }
  });
  if (existingProfile) {
    throw new Error("Technician profile already exists.");
  }
  const result = await prisma.technicianProfile.create({
    data: {
      ...payload,
      userId
    }
  });
  return result;
};
var updateAvailability = async (technicianId, payload) => {
  const { isAvailable, slots } = payload;
  const result = await prisma.$transaction(async (tx) => {
    await tx.technicianProfile.update({
      where: {
        id: technicianId
      },
      data: {
        isAvailable
      }
    });
    await tx.availabilitySlot.deleteMany({
      where: {
        technicianId
      }
    });
    if (slots.length > 0) {
      await tx.availabilitySlot.createMany({
        data: slots.map((slot) => ({
          technicianId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime
        }))
      });
    }
    return tx.technicianProfile.findUnique({
      where: {
        id: technicianId
      },
      include: {
        availability: {
          orderBy: [
            {
              dayOfWeek: "asc"
            },
            {
              startTime: "asc"
            }
          ]
        }
      }
    });
  });
  return result;
};
var getAllTechnicians = async (query) => {
  const {
    searchTerm,
    location,
    category,
    experience,
    minRating,
    maxHourlyRate,
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          user: {
            name: {
              contains: searchTerm,
              mode: "insensitive"
            }
          }
        },
        {
          bio: {
            contains: searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (location) {
    andConditions.push({
      user: {
        city: {
          equals: location,
          mode: "insensitive"
        }
      }
    });
  }
  if (experience) {
    andConditions.push({
      experience: {
        gte: Number(experience)
      }
    });
  }
  if (minRating) {
    andConditions.push({
      averageRating: {
        gte: Number(minRating)
      }
    });
  }
  if (maxHourlyRate) {
    andConditions.push({
      hourlyRate: {
        lte: Number(maxHourlyRate)
      }
    });
  }
  if (category) {
    andConditions.push({
      services: {
        some: {
          category: {
            name: {
              equals: category,
              mode: "insensitive"
            }
          }
        }
      }
    });
  }
  const where = andConditions.length ? { AND: andConditions } : {};
  const technicians = await prisma.technicianProfile.findMany({
    where,
    skip,
    take: limitNumber,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      user: true,
      services: {
        include: {
          category: true
        }
      }
    }
  });
  const total = await prisma.technicianProfile.count({
    where
  });
  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total
    },
    data: technicians
  };
};
var getSingleTechnician = async (id) => {
  const result = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      id
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
          address: true
        }
      },
      //services: true,
      reviews: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              profileImage: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  return result;
};
var updateProfile = async (userId, payload) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId
    }
  });
  if (!technician) {
    throw new Error("Technician profile not found");
  }
  return prisma.technicianProfile.update({
    where: {
      userId
    },
    data: payload
  });
};
var getMyBookings = async (userId) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId
    }
  });
  if (!technician) {
    throw new Error("Technician profile not found");
  }
  return prisma.booking.findMany({
    where: {
      technicianId: technician.id
    },
    include: {
      customer: true,
      service: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateBookingStatus = async (userId, bookingId, payload) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId
    }
  });
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId
    }
  });
  if (booking.technicianId !== technician.id) {
    throw new Error("You are not authorized to update this booking.");
  }
  const result = await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      status: payload.status
    },
    include: {
      customer: true,
      service: true,
      technician: {
        include: {
          user: true
        }
      }
    }
  });
  return result;
};
var TechnicianService = {
  createTechnician,
  getAllTechnicians,
  getSingleTechnician,
  updateProfile,
  getMyBookings,
  updateBookingStatus,
  updateAvailability
};

// src/modules/technicians/technician.controller.ts
var createTechnician2 = catchAsync(
  async (req, res, next) => {
    const userId = req.users?.id;
    const payload = req.body;
    const result = await TechnicianService.createTechnician(
      userId,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.CREATED,
      message: "Technician profile created successfully",
      data: result
    });
  }
);
var getAllTechnicians2 = catchAsync(async (req, res) => {
  const result = await TechnicianService.getAllTechnicians(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "Technicians retrieved successfully",
    data: result
  });
});
var updateAvailability2 = catchAsync(
  async (req, res) => {
    const id = req.users?.id;
    const result = await TechnicianService.updateAvailability(
      id,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus5.OK,
      success: true,
      message: "Availability updated successfully",
      data: result
    });
  }
);
var getSingleTechnician2 = catchAsync(async (req, res) => {
  const result = await TechnicianService.getSingleTechnician(
    req.params.id
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "Technician retrieved successfully",
    data: result
  });
});
var updateProfile2 = catchAsync(async (req, res) => {
  const userId = req.users.id;
  const result = await TechnicianService.updateProfile(
    userId,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "Technician profile updated successfully",
    data: result
  });
});
var getMyBookings2 = catchAsync(async (req, res) => {
  const userId = req.users?.id;
  const result = await TechnicianService.getMyBookings(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "Technician bookings retrieved successfully",
    data: result
  });
});
var updateBookingStatus2 = catchAsync(async (req, res) => {
  const result = await TechnicianService.updateBookingStatus(
    req.users?.id,
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking status updated successfully",
    data: result
  });
});
var TechnicianController = {
  createTechnician: createTechnician2,
  getAllTechnicians: getAllTechnicians2,
  getSingleTechnician: getSingleTechnician2,
  updateProfile: updateProfile2,
  getMyBookings: getMyBookings2,
  updateBookingStatus: updateBookingStatus2,
  updateAvailability: updateAvailability2
};

// src/modules/technicians/technician.route.ts
var router3 = Router3();
router3.post("/create", auth(UserRole.ADMIN, UserRole.TECHNICIAN), TechnicianController.createTechnician);
router3.get("/", TechnicianController.getAllTechnicians);
router3.get("/bookings", auth(UserRole.ADMIN, UserRole.TECHNICIAN), TechnicianController.getMyBookings);
router3.get("/:id", TechnicianController.getSingleTechnician);
router3.patch("/bookings/:id", auth(UserRole.ADMIN, UserRole.TECHNICIAN), TechnicianController.updateBookingStatus);
router3.put("/profile", auth(UserRole.ADMIN, UserRole.TECHNICIAN), TechnicianController.updateProfile);
router3.put("/availability", auth(UserRole.ADMIN, UserRole.TECHNICIAN), TechnicianController.updateAvailability);
var technicianRoutes = router3;

// src/modules/admin/admin.route.ts
import { Router as Router4 } from "express";

// src/modules/admin/ admin.controller.ts
import httpStatus6 from "http-status";

// src/modules/admin/ admin.service.ts
var getAllUsers = async () => {
  return prisma.users.findMany({
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      role: true,
      status: true,
      createdAt: true
    }
  });
};
var updateUserStatus = async (id, status) => {
  return prisma.users.update({
    where: {
      id
    },
    data: {
      status
    },
    omit: {
      password: true,
      profileImage: true
    }
  });
};
var getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      customer: true,
      technician: {
        include: {
          user: true
        }
      },
      service: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc"
    }
  });
};
var createCategory = async (payload) => {
  return prisma.category.createMany({
    data: payload
  });
};
var adminService = {
  getAllUsers,
  getAllBookings,
  updateUserStatus,
  getAllCategories,
  createCategory
};

// src/modules/admin/ admin.controller.ts
var getAllUsers2 = catchAsync(async (req, res) => {
  const result = await adminService.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Users retrieved successfully",
    data: result
  });
});
var updateUserStatus2 = catchAsync(async (req, res) => {
  const result = await adminService.updateUserStatus(
    req.params.id,
    req.body.status
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "User status updated successfully",
    data: result
  });
});
var getAllBookings2 = catchAsync(async (req, res) => {
  const result = await adminService.getAllBookings();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Bookings retrieved successfully",
    data: result
  });
});
var getAllCategories2 = catchAsync(async (req, res) => {
  const result = await adminService.getAllCategories();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Categories retrieved successfully",
    data: result
  });
});
var createCategory2 = catchAsync(async (req, res) => {
  const result = await adminService.createCategory(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.CREATED,
    message: "Category created successfully",
    data: result
  });
});
var AdminController = {
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  getAllBookings: getAllBookings2,
  getAllCategories: getAllCategories2,
  createCategory: createCategory2
};

// src/modules/admin/admin.route.ts
var router4 = Router4();
router4.get("/users", auth(UserRole.ADMIN), AdminController.getAllUsers);
router4.patch(
  "/users/:id",
  auth(UserRole.ADMIN),
  AdminController.updateUserStatus
);
router4.get(
  "/bookings",
  auth(UserRole.ADMIN),
  AdminController.getAllBookings
);
router4.get(
  "/categories",
  auth(UserRole.ADMIN),
  AdminController.getAllCategories
);
router4.post(
  "/categories",
  auth(UserRole.ADMIN),
  AdminController.createCategory
);
var adminRoutes = router4;

// src/modules/booking/booking.route.ts
import express from "express";

// src/modules/booking/booking.service.ts
var createBooking = async (customerId, payload) => {
  await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      id: payload.technicianId
    }
  });
  await prisma.service.findUniqueOrThrow({
    where: {
      id: payload.serviceId
    }
  });
  const booking = await prisma.booking.create({
    data: {
      bookingDate: new Date(payload.bookingDate),
      customerAddress: payload.customerAddress,
      note: payload.note,
      totalAmount: payload.totalAmount,
      customerId,
      technicianId: payload.technicianId,
      serviceId: payload.serviceId
    },
    include: {
      customer: true,
      technician: true,
      service: true
    }
  });
  return booking;
};
var getMyBookings3 = async (customerId) => {
  return prisma.booking.findMany({
    where: {
      customerId
    },
    include: {
      technician: true,
      service: true,
      payments: true,
      review: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getBookingDetails = async (bookingId, customerId) => {
  return prisma.booking.findFirstOrThrow({
    where: {
      id: bookingId,
      customerId
    },
    include: {
      customer: true,
      technician: true,
      service: true,
      payments: true,
      review: true
    }
  });
};
var BookingServices = {
  createBooking,
  getMyBookings: getMyBookings3,
  getBookingDetails
};

// src/modules/booking/booking.controller.ts
var createBooking2 = catchAsync(async (req, res) => {
  const result = await BookingServices.createBooking(
    req.users?.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Booking created successfully",
    data: result
  });
});
var getMyBookings4 = catchAsync(async (req, res) => {
  const result = await BookingServices.getMyBookings(
    req.users?.id
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Bookings retrieved successfully",
    data: result
  });
});
var getBookingDetails2 = catchAsync(async (req, res) => {
  const result = await BookingServices.getBookingDetails(
    req.params.id,
    req.users?.id
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking retrieved successfully",
    data: result
  });
});
var BookingControllers = {
  createBooking: createBooking2,
  getMyBookings: getMyBookings4,
  getBookingDetails: getBookingDetails2
};

// src/modules/booking/booking.route.ts
var router5 = express.Router();
router5.post("/", auth(UserRole.ADMIN, UserRole.CUSTOMER), BookingControllers.createBooking);
router5.get("/", auth(UserRole.ADMIN, UserRole.CUSTOMER), BookingControllers.getMyBookings);
router5.get("/:id", auth(UserRole.ADMIN, UserRole.CUSTOMER), BookingControllers.getBookingDetails);
var BookingRoutes = router5;

// src/modules/services/service.route.ts
import { Router as Router5 } from "express";

// src/modules/services/service.service.ts
var createService = async (payload) => {
  await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      id: payload.technicianId
    }
  });
  await prisma.category.findUniqueOrThrow({
    where: {
      id: payload.categoryId
    }
  });
  return prisma.service.create({
    data: payload
  });
};
var getAllServices = async (query) => {
  const {
    type,
    location,
    rating,
    searchTerm,
    minPrice,
    maxPrice,
    page = "1",
    limit = "8",
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (type) {
    andConditions.push({
      category: {
        name: {
          equals: type,
          mode: "insensitive"
        }
      }
    });
  }
  if (location) {
    andConditions.push({
      serviceArea: {
        contains: location,
        mode: "insensitive"
      }
    });
  }
  if (rating) {
    andConditions.push({
      bookings: {
        some: {
          review: {
            rating: {
              gte: Number(rating)
            }
          }
        }
      }
    });
  }
  if (minPrice || maxPrice) {
    andConditions.push({
      price: {
        ...minPrice && { gte: Number(minPrice) },
        ...maxPrice && { lte: Number(maxPrice) }
      }
    });
  }
  const whereConditions = andConditions.length ? { AND: andConditions } : {};
  const result = await prisma.service.findMany({
    where: whereConditions,
    skip,
    take: limitNumber,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      category: true,
      technician: {
        include: {
          user: true
        }
      },
      bookings: {
        include: {
          review: true
        }
      }
    }
  });
  const total = await prisma.service.count({
    where: whereConditions
  });
  const totalPage = Math.ceil(total / limitNumber);
  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage
    },
    data: result
  };
};
var ServiceServices = {
  createService,
  getAllServices
};

// src/modules/services/service.controller.ts
import httpStatus7 from "http-status";
var createService2 = catchAsync(async (req, res) => {
  const result = await ServiceServices.createService(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Service created successfully",
    data: result
  });
});
var getAllServices2 = catchAsync(async (req, res) => {
  const result = await ServiceServices.getAllServices(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus7.OK,
    message: "Services retrieved successfully",
    data: result
  });
});
var ServiceControllers = {
  createService: createService2,
  //getServices,
  getAllServices: getAllServices2
};

// src/modules/services/service.route.ts
var router6 = Router5();
router6.post("/", auth(UserRole.ADMIN), ServiceControllers.createService);
router6.get("/", ServiceControllers.getAllServices);
var ServiceRoutes = router6;

// src/modules/category/category.route.ts
import { Router as Router6 } from "express";

// src/modules/category/category.service.ts
var getCategories = async () => {
  return await prisma.category.findMany({
    include: {
      services: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var CategoryServices = {
  getCategories
};

// src/modules/category/category.controller.ts
var getCategories2 = catchAsync(async (req, res) => {
  const result = await CategoryServices.getCategories();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Categories retrieved successfully",
    data: result
  });
});
var CategoryControllers = {
  getCategories: getCategories2
};

// src/modules/category/category.route.ts
var router7 = Router6();
router7.get("/", CategoryControllers.getCategories);
var CategoryRoutes = router7;

// src/modules/review/review.route.ts
import { Router as Router7 } from "express";

// src/modules/review/review.service.ts
var createReview = async (customerId, payload) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: payload.bookingId
    },
    include: {
      technician: true
    }
  });
  if (booking.customerId !== customerId) {
    throw new Error("Unauthorized");
  }
  if (booking.status !== BookingStatus.COMPLETED) {
    throw new Error("Review can only be submitted after job completion.");
  }
  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId: payload.bookingId
    }
  });
  if (existingReview) {
    throw new Error("Review already exists.");
  }
  const review = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      bookingId: booking.id,
      customerId,
      technicianId: booking.technicianId
    }
  });
  const reviews = await prisma.review.findMany({
    where: {
      technicianId: booking.technicianId
    }
  });
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, item) => sum + item.rating, 0) / totalReviews;
  await prisma.technicianProfile.update({
    where: {
      id: booking.technicianId
    },
    data: {
      totalReviews,
      averageRating
    }
  });
  return review;
};
var ReviewServices = {
  createReview
};

// src/modules/review/review.controller.ts
var createReview2 = catchAsync(async (req, res) => {
  const result = await ReviewServices.createReview(
    req.users.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review created successfully",
    data: result
  });
});
var ReviewControllers = {
  createReview: createReview2
};

// src/modules/review/review.route.ts
var router8 = Router7();
router8.post("/", auth(UserRole.CUSTOMER), ReviewControllers.createReview);
var ReviewRoutes = router8;

// src/modules/payment/payment.route.ts
import express2 from "express";

// src/lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(config_default.stripe_secret_key);

// src/modules/payment/payment.service.ts
var createPayment = async (customerId, payload) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: payload.bookingId
    },
    include: {
      service: true,
      payments: true
    }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.customerId !== customerId) {
    throw new Error("Unauthorized");
  }
  if (booking.status !== BookingStatus.ACCEPTED && booking.status !== BookingStatus.COMPLETED) {
    throw new Error(
      `Payment is allowed only for accepted or completed bookings. Current status: ${booking.status}`
    );
  }
  if (booking.payments.length > 0) {
    throw new Error("Payment already exists");
  }
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "bdt",
          unit_amount: Math.round(Number(booking.service.price) * 100),
          product: process.env.STRIPE_PRODUCT_ID
        },
        quantity: 1
      }
    ],
    success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
    metadata: {
      bookingId: booking.id,
      customerId
    }
  });
  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      amount: booking.service.price,
      transactionId: session.id,
      // Store Checkout Session ID
      provider: "STRIPE",
      method: "CARD",
      status: PaymentStatus.PENDING
    }
  });
  return {
    checkoutUrl: session.url,
    sessionId: session.id,
    payment
  };
};
var handleWebhook = async (signature, body) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    throw new Error("Invalid Stripe webhook signature.");
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.payment_status !== "paid") {
        break;
      }
      const paymentId = session.metadata?.paymentId;
      if (!paymentId) {
        throw new Error("Payment ID not found in session metadata.");
      }
      await prisma.payment.update({
        where: {
          id: paymentId
        },
        data: {
          status: PaymentStatus.COMPLETED,
          transactionId: typeof session.payment_intent === "string" ? session.payment_intent : session.id,
          paidAt: /* @__PURE__ */ new Date()
        }
      });
      console.log(`\u2705 Payment ${paymentId} completed.`);
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      const paymentId = session.metadata?.paymentId;
      if (!paymentId) {
        break;
      }
      await prisma.payment.update({
        where: {
          id: paymentId
        },
        data: {
          status: PaymentStatus.FAILED
        }
      });
      console.log(`Payment ${paymentId} expired.`);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  return {
    received: true
  };
};
var getPayments = async (customerId) => {
  return prisma.payment.findMany({
    where: {
      booking: {
        customerId
      }
    },
    include: {
      booking: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getPayment = async (customerId, paymentId) => {
  return prisma.payment.findFirstOrThrow({
    where: {
      id: paymentId,
      booking: {
        customerId
      }
    },
    include: {
      booking: true
    }
  });
};
var PaymentService = {
  createPayment,
  handleWebhook,
  //confirmPayment,
  getPayments,
  getPayment
};

// src/modules/payment/payment.controller.ts
var createPayment2 = catchAsync(async (req, res) => {
  const result = await PaymentService.createPayment(
    req.users.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Stripe Checkout session created successfully",
    data: result
  });
});
var handleWebhook2 = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  if (!signature || typeof signature !== "string") {
    throw new Error("Missing Stripe-Signature header");
  }
  const result = await PaymentService.handleWebhook(
    signature,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Webhook processed successfully",
    data: result
  });
});
var getPayments2 = catchAsync(async (req, res) => {
  const result = await PaymentService.getPayments(req.users?.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payments retrieved successfully",
    data: result
  });
});
var getPayment2 = catchAsync(async (req, res) => {
  const result = await PaymentService.getPayment(
    req.users.id,
    req.params.id
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment retrieved successfully",
    data: result
  });
});
var PaymentController = {
  createPayment: createPayment2,
  handleWebhook: handleWebhook2,
  //confirmPayment,
  getPayments: getPayments2,
  getPayment: getPayment2
};

// src/modules/payment/payment.route.ts
var router9 = express2.Router();
router9.post("/create", auth(UserRole.ADMIN, UserRole.CUSTOMER), PaymentController.createPayment);
router9.post(
  "/webhook",
  express2.raw({ type: "application/json" }),
  PaymentController.handleWebhook
);
router9.get("/", auth(UserRole.ADMIN, UserRole.CUSTOMER), PaymentController.getPayments);
router9.get("/:id", auth(UserRole.ADMIN, UserRole.CUSTOMER), PaymentController.getPayment);
var PaymentRoutes = router9;

// src/app.ts
var app = express3();
app.use(
  cors({
    origin: config_default.app_url,
    credentials: true
  })
);
app.use(
  "/api/payments/webhook",
  express3.raw({ type: "application/json" })
);
app.use(express3.json());
app.use(express3.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api/auth", userRoutes, authRoutes);
app.use("/api/services", ServiceRoutes);
app.use("/api/bookings", BookingRoutes);
app.use("/api/payments", PaymentRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/reviews", ReviewRoutes);
app.use("/api/admin", adminRoutes);
app.get("/payment/success", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Payment completed successfully.",
    sessionId: req.query.session_id
  });
});
app.get("/payment/cancel", (req, res) => {
  res.status(200).json({
    success: false,
    message: "Payment was cancelled."
  });
});
app.use(notFoundHandler);
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
var PORT = config_default.port;
async function main() {
  try {
    console.log("Connected to the database successfully.");
    app_default.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}
main();
//# sourceMappingURL=server.js.map