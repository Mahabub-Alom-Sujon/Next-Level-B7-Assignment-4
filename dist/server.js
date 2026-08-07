
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
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Users {\n  id               String             @id @default(uuid())\n  name             String\n  email            String             @unique\n  password         String\n  phone            String?            @unique\n  profileImage     String?\n  address          String?\n  city             String?\n  district         String?\n  postalCode       String?\n  role             UserRole           @default(CUSTOMER)\n  status           UserStatus         @default(ACTIVE)\n  isActive         Boolean            @default(true)\n  isBanned         Boolean            @default(false)\n  technician       TechnicianProfile?\n  customerBookings Booking[]          @relation("CustomerBookings")\n  reviews          Review[]\n  payments         Payment[]\n  createdAt        DateTime           @default(now())\n  updatedAt        DateTime           @default(now()) @updatedAt\n}\n\nmodel TechnicianProfile {\n  id            String             @id @default(uuid())\n  bio           String?\n  experience    Int                @default(0)\n  hourlyRate    Int? // stored in smallest currency unit (e.g., 50000 = 500.00 BDT)\n  skills        String?\n  nationalId    String?\n  certification String?\n  averageRating Float              @default(0)\n  totalReviews  Int                @default(0)\n  completedJobs Int                @default(0)\n  isAvailable   Boolean            @default(true)\n  services      Service[]\n  bookings      Booking[]\n  reviews       Review[]\n  availability  AvailabilitySlot[]\n  userId        String             @unique\n  user          Users              @relation(fields: [userId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  createdAt     DateTime           @default(now())\n  updatedAt     DateTime           @default(now()) @updatedAt\n}\n\nmodel AvailabilitySlot {\n  id           String            @id @default(cuid())\n  technicianId String\n  dayOfWeek    Int // 0 = Sunday ... 6 = Saturday\n  startTime    String // e.g. "09:00"\n  endTime      String // e.g. "17:00"\n  isAvailable  Boolean           @default(true)\n  createdAt    DateTime          @default(now())\n  updatedAt    DateTime          @updatedAt\n  // Relation\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  @@unique([technicianId, dayOfWeek, startTime, endTime])\n}\n\nmodel Category {\n  id          String    @id @default(uuid())\n  name        String    @unique\n  description String?\n  icon        String?\n  services    Service[]\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime  @default(now()) @updatedAt\n}\n\nmodel Service {\n  id           String            @id @default(uuid())\n  title        String\n  description  String?\n  image        String? // URL or path of the service image\n  price        Int // smallest currency unit (e.g., 150000 = 1,500.00 BDT)\n  duration     Int // Minutes\n  serviceArea  String?\n  isAvailable  Boolean           @default(true)\n  featured     Boolean?          @default(false)\n  bookings     Booking[]\n  technicianId String\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  categoryId   String\n  category     Category          @relation(fields: [categoryId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  createdAt    DateTime          @default(now())\n  updatedAt    DateTime          @default(now()) @updatedAt\n}\n\nmodel Booking {\n  id           String            @id @default(uuid())\n  bookingDate  DateTime\n  bookingTime  String?\n  note         String?\n  address      String?\n  status       BookingStatus     @default(REQUESTED)\n  isAvailable  Boolean           @default(true)\n  isBooked     Boolean           @default(false)\n  payments     Payment?\n  review       Review?\n  customerId   String\n  customer     Users             @relation("CustomerBookings", fields: [customerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  technicianId String\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  serviceId    String\n  service      Service           @relation(fields: [serviceId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  createdAt    DateTime          @default(now())\n  updatedAt    DateTime          @default(now()) @updatedAt\n}\n\nmodel Payment {\n  id            String          @id @default(uuid())\n  transactionId String?         @unique\n  amount        Int\n  provider      PaymentProvider @default(STRIPE)\n  method        PaymentMethod   @default(CARD)\n  status        PaymentStatus   @default(PENDING)\n  paidAt        DateTime?\n  bookingId     String          @unique\n  booking       Booking         @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n  userId        String?\n  user          Users?          @relation(fields: [userId], references: [id], onDelete: SetNull)\n  createdAt     DateTime        @default(now())\n  updatedAt     DateTime        @updatedAt\n}\n\nmodel Review {\n  id           String            @id @default(uuid())\n  rating       Int\n  comment      String?\n  bookingId    String            @unique\n  booking      Booking           @relation(fields: [bookingId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  customerId   String\n  customer     Users             @relation(fields: [customerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  technicianId String\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  createdAt    DateTime          @default(now())\n  updatedAt    DateTime          @default(now()) @updatedAt\n}\n\nenum UserRole {\n  CUSTOMER\n  TECHNICIAN\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  BLOCKED\n}\n\nenum BookingStatus {\n  REQUESTED\n  ACCEPTED\n  DECLINED\n  PAID\n  IN_PROGRESS\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentProvider {\n  STRIPE\n}\n\nenum PaymentMethod {\n  CARD\n  MOBILE_BANKING\n  BANK\n  CASH\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n  REFUNDED\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"Users":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"profileImage","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"district","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isBanned","kind":"scalar","type":"Boolean"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"TechnicianProfileToUsers"},{"name":"customerBookings","kind":"object","type":"Booking","relationName":"CustomerBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUsers"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUsers"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TechnicianProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"hourlyRate","kind":"scalar","type":"Int"},{"name":"skills","kind":"scalar","type":"String"},{"name":"nationalId","kind":"scalar","type":"String"},{"name":"certification","kind":"scalar","type":"String"},{"name":"averageRating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"completedJobs","kind":"scalar","type":"Int"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"services","kind":"object","type":"Service","relationName":"ServiceToTechnicianProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTechnicianProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTechnicianProfile"},{"name":"availability","kind":"object","type":"AvailabilitySlot","relationName":"AvailabilitySlotToTechnicianProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"Users","relationName":"TechnicianProfileToUsers"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"AvailabilitySlot":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"dayOfWeek","kind":"scalar","type":"Int"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"AvailabilitySlotToTechnicianProfile"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"services","kind":"object","type":"Service","relationName":"CategoryToService"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Service":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"serviceArea","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"featured","kind":"scalar","type":"Boolean"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToService"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"ServiceToTechnicianProfile"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToService"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingDate","kind":"scalar","type":"DateTime"},{"name":"bookingTime","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"payments","kind":"object","type":"Payment","relationName":"BookingToPayment"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"Users","relationName":"CustomerBookings"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"BookingToTechnicianProfile"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"service","kind":"object","type":"Service","relationName":"BookingToService"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Int"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"method","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"Users","relationName":"PaymentToUsers"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"Users","relationName":"ReviewToUsers"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"ReviewToTechnicianProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","booking","user","payments","customer","technician","review","service","bookings","services","_count","category","reviews","availability","customerBookings","Users.findUnique","Users.findUniqueOrThrow","Users.findFirst","Users.findFirstOrThrow","Users.findMany","data","Users.createOne","Users.createMany","Users.createManyAndReturn","Users.updateOne","Users.updateMany","Users.updateManyAndReturn","create","update","Users.upsertOne","Users.deleteOne","Users.deleteMany","having","_min","_max","Users.groupBy","Users.aggregate","TechnicianProfile.findUnique","TechnicianProfile.findUniqueOrThrow","TechnicianProfile.findFirst","TechnicianProfile.findFirstOrThrow","TechnicianProfile.findMany","TechnicianProfile.createOne","TechnicianProfile.createMany","TechnicianProfile.createManyAndReturn","TechnicianProfile.updateOne","TechnicianProfile.updateMany","TechnicianProfile.updateManyAndReturn","TechnicianProfile.upsertOne","TechnicianProfile.deleteOne","TechnicianProfile.deleteMany","_avg","_sum","TechnicianProfile.groupBy","TechnicianProfile.aggregate","AvailabilitySlot.findUnique","AvailabilitySlot.findUniqueOrThrow","AvailabilitySlot.findFirst","AvailabilitySlot.findFirstOrThrow","AvailabilitySlot.findMany","AvailabilitySlot.createOne","AvailabilitySlot.createMany","AvailabilitySlot.createManyAndReturn","AvailabilitySlot.updateOne","AvailabilitySlot.updateMany","AvailabilitySlot.updateManyAndReturn","AvailabilitySlot.upsertOne","AvailabilitySlot.deleteOne","AvailabilitySlot.deleteMany","AvailabilitySlot.groupBy","AvailabilitySlot.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Service.findUnique","Service.findUniqueOrThrow","Service.findFirst","Service.findFirstOrThrow","Service.findMany","Service.createOne","Service.createMany","Service.createManyAndReturn","Service.updateOne","Service.updateMany","Service.updateManyAndReturn","Service.upsertOne","Service.deleteOne","Service.deleteMany","Service.groupBy","Service.aggregate","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","Booking.groupBy","Booking.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","rating","comment","bookingId","customerId","technicianId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","transactionId","amount","PaymentProvider","provider","PaymentMethod","method","PaymentStatus","status","paidAt","userId","bookingDate","bookingTime","note","address","BookingStatus","isAvailable","isBooked","serviceId","title","description","image","price","duration","serviceArea","featured","categoryId","name","icon","every","some","none","dayOfWeek","startTime","endTime","bio","experience","hourlyRate","skills","nationalId","certification","averageRating","totalReviews","completedJobs","email","password","phone","profileImage","city","district","postalCode","UserRole","role","UserStatus","isActive","isBanned","technicianId_dayOfWeek_startTime_endTime","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "3gRPgAEXBQAAtAIAIAcAALMCACAOAACbAgAgEAAAmgIAIJkBAACwAgAwmgEAAA8AEJsBAACwAgAwnAEBAAAAAaIBQACMAgAhowFAAIwCACG2AQAAsgLkASK8AQEAiwIAIckBAQCKAgAh2gEBAAAAAdsBAQCKAgAh3AEBAAAAAd0BAQCLAgAh3gEBAIsCACHfAQEAiwIAIeABAQCLAgAh4gEAALEC4gEi5AEgAJkCACHlASAAmQIAIQEAAAABACAWBAAAnQIAIAoAAJoCACALAACNAgAgDgAAmwIAIA8AAJwCACCZAQAAlQIAMJoBAAADABCbAQAAlQIAMJwBAQCKAgAhogFAAIwCACGjAUAAjAIAIbgBAQCKAgAhvgEgAJkCACHRAQEAiwIAIdIBAgCWAgAh0wECAJcCACHUAQEAiwIAIdUBAQCLAgAh1gEBAIsCACHXAQgAmAIAIdgBAgCWAgAh2QECAJYCACEBAAAAAwAgEwcAAK4CACAKAACaAgAgDQAAvAIAIJkBAAC6AgAwmgEAAAUAEJsBAAC6AgAwnAEBAIoCACGhAQEAigIAIaIBQACMAgAhowFAAIwCACG-ASAAmQIAIcEBAQCKAgAhwgEBAIsCACHDAQEAiwIAIcQBAgCWAgAhxQECAJYCACHGAQEAiwIAIccBIAC7AgAhyAEBAIoCACEHBwAAkwQAIAoAAN8DACANAACZBAAgwgEAAL0CACDDAQAAvQIAIMYBAAC9AgAgxwEAAL0CACATBwAArgIAIAoAAJoCACANAAC8AgAgmQEAALoCADCaAQAABQAQmwEAALoCADCcAQEAAAABoQEBAIoCACGiAUAAjAIAIaMBQACMAgAhvgEgAJkCACHBAQEAigIAIcIBAQCLAgAhwwEBAIsCACHEAQIAlgIAIcUBAgCWAgAhxgEBAIsCACHHASAAuwIAIcgBAQCKAgAhAwAAAAUAIAEAAAYAMAIAAAcAIBUFAAC3AgAgBgAAnQIAIAcAAK4CACAIAAC4AgAgCQAAuQIAIJkBAAC1AgAwmgEAAAkAEJsBAAC1AgAwnAEBAIoCACGgAQEAigIAIaEBAQCKAgAhogFAAIwCACGjAUAAjAIAIbYBAAC2Ar4BIrkBQACMAgAhugEBAIsCACG7AQEAiwIAIbwBAQCLAgAhvgEgAJkCACG_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_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-ASAA_wEAIc4BAgDjAQAhzwEBAOIBACHQAQEA4gEAIQMAAAAaACABAABqADAiAABrACADAAAAGgAgAQAAGwAwAgAAHAAgCgsAAI0CACCZAQAAiQIAMJoBAABxABCbAQAAiQIAMJwBAQAAAAGiAUAAjAIAIaMBQACMAgAhwgEBAIsCACHJAQEAAAABygEBAIsCACEBAAAAbgAgAQAAAG4AIAoLAACNAgAgmQEAAIkCADCaAQAAcQAQmwEAAIkCADCcAQEAigIAIaIBQACMAgAhowFAAIwCACHCAQEAiwIAIckBAQCKAgAhygEBAIsCACEDCwAAnAMAIMIBAAC9AgAgygEAAL0CACADAAAAcQAgAQAAcgAwAgAAbgAgAwAAAHEAIAEAAHIAMAIAAG4AIAMAAABxACABAAByADACAABuACAHCwAAmwMAIJwBAQAAAAGiAUAAAAABowFAAAAAAcIBAQAAAAHJAQEAAAABygEBAAAAAQEWAAB2ACAGnAEBAAAAAaIBQAAAAAGjAUAAAAABwgEBAAAAAckBAQAAAAHKAQEAAAABARYAAHgAMAEWAAB4ADAHCwAAjgMAIJwBAQDDAgAhogFAAMYCACGjAUAAxgIAIcIBAQDFAgAhyQEBAMMCACHKAQEAxQIAIQIAAABuACAWAAB7ACAGnAEBAMMCACGiAUAAxgIAIaMBQADGAgAhwgEBAMUCACHJAQEAwwIAIcoBAQDFAgAhAgAAAHEAIBYAAH0AIAIAAABxACAWAAB9ACADAAAAbgAgHQAAdgAgHgAAewAgAQAAAG4AIAEAAABxACAFDAAAiwMAICMAAI0DACAkAACMAwAgwgEAAL0CACDKAQAAvQIAIAmZAQAAiAIAMJoBAACEAQAQmwEAAIgCADCcAQEA4gEAIaIBQADlAQAhowFAAOUBACHCAQEA5AEAIckBAQDiAQAhygEBAOQBACEDAAAAcQAgAQAAgwEAMCIAAIQBACADAAAAcQAgAQAAcgAwAgAAbgAgAQAAAAcAIAEAAAAHACADAAAABQAgAQAABgAwAgAABwAgAwAAAAUAIAEAAAYAMAIAAAcAIAMAAAAFACABAAAGADACAAAHACAQBwAAiQMAIAoAAIgDACANAACKAwAgnAEBAAAAAaEBAQAAAAGiAUAAAAABowFAAAAAAb4BIAAAAAHBAQEAAAABwgEBAAAAAcMBAQAAAAHEAQIAAAABxQECAAAAAcYBAQAAAAHHASAAAAAByAEBAAAAAQEWAACMAQAgDZwBAQAAAAGhAQEAAAABogFAAAAAAaMBQAAAAAG-ASAAAAABwQEBAAAAAcIBAQAAAAHDAQEAAAABxAECAAAAAcUBAgAAAAHGAQEAAAABxwEgAAAAAcgBAQAAAAEBFgAAjgEAMAEWAACOAQAwEAcAAPoCACAKAAD5AgAgDQAA-wIAIJwBAQDDAgAhoQEBAMMCACGiAUAAxgIAIaMBQADGAgAhvgEgAN4CACHBAQEAwwIAIcIBAQDFAgAhwwEBAMUCACHEAQIAxAIAIcUBAgDEAgAhxgEBAMUCACHHASAA-AIAIcgBAQDDAgAhAgAAAAcAIBYAAJEBACANnAEBAMMCACGhAQEAwwIAIaIBQADGAgAhowFAAMYCACG-ASAA3gIAIcEBAQDDAgAhwgEBAMUCACHDAQEAxQIAIcQBAgDEAgAhxQECAMQCACHGAQEAxQIAIccBIAD4AgAhyAEBAMMCACECAAAABQAgFgAAkwEAIAIAAAAFACAWAACTAQAgAwAAAAcAIB0AAIwBACAeAACRAQAgAQAAAAcAIAEAAAAFACAJDAAA8wIAICMAAPYCACAkAAD1AgAgNQAA9AIAIDYAAPcCACDCAQAAvQIAIMMBAAC9AgAgxgEAAL0CACDHAQAAvQIAIBCZAQAAhAIAMJoBAACaAQAQmwEAAIQCADCcAQEA4gEAIaEBAQDiAQAhogFAAOUBACGjAUAA5QEAIb4BIAD_AQAhwQEBAOIBACHCAQEA5AEAIcMBAQDkAQAhxAECAOMBACHFAQIA4wEAIcYBAQDkAQAhxwEgAIUCACHIAQEA4gEAIQMAAAAFACABAACZAQAwIgAAmgEAIAMAAAAFACABAAAGADACAAAHACABAAAACwAgAQAAAAsAIAMAAAAJACABAAAKADACAAALACADAAAACQAgAQAACgAwAgAACwAgAwAAAAkAIAEAAAoAMAIAAAsAIBIFAADuAgAgBgAA8AIAIAcAAPECACAIAADvAgAgCQAA8gIAIJwBAQAAAAGgAQEAAAABoQEBAAAAAaIBQAAAAAGjAUAAAAABtgEAAAC-AQK5AUAAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvgEgAAAAAb8BIAAAAAHAAQEAAAABARYAAKIBACANnAEBAAAAAaABAQAAAAGhAQEAAAABogFAAAAAAaMBQAAAAAG2AQAAAL4BArkBQAAAAAG6AQEAAAABuwEBAAAAAbwBAQAAAAG-ASAAAAABvwEgAAAAAcABAQAAAAEBFgAApAEAMAEWAACkAQAwEgUAAN8CACAGAADhAgAgBwAA4gIAIAgAAOACACAJAADjAgAgnAEBAMMCACGgAQEAwwIAIaEBAQDDAgAhogFAAMYCACGjAUAAxgIAIbYBAADdAr4BIrkBQADGAgAhugEBAMUCACG7AQEAxQIAIbwBAQDFAgAhvgEgAN4CACG_ASAA3gIAIcABAQDDAgAhAgAAAAsAIBYAAKcBACANnAEBAMMCACGgAQEAwwIAIaEBAQDDAgAhogFAAMYCACGjAUAAxgIAIbYBAADdAr4BIrkBQADGAgAhugEBAMUCACG7AQEAxQIAIbwBAQDFAgAhvgEgAN4CACG_ASAA3gIAIcABAQDDAgAhAgAAAAkAIBYAAKkBACACAAAACQAgFgAAqQEAIAMAAAALACAdAACiAQAgHgAApwEAIAEAAAALACABAAAACQAgBgwAANoCACAjAADcAgAgJAAA2wIAILoBAAC9AgAguwEAAL0CACC8AQAAvQIAIBCZAQAA_QEAMJoBAACwAQAQmwEAAP0BADCcAQEA4gEAIaABAQDiAQAhoQEBAOIBACGiAUAA5QEAIaMBQADlAQAhtgEAAP4BvgEiuQFAAOUBACG6AQEA5AEAIbsBAQDkAQAhvAEBAOQBACG-ASAA_wEAIb8BIAD_AQAhwAEBAOIBACEDAAAACQAgAQAArwEAMCIAALABACADAAAACQAgAQAACgAwAgAACwAgAQAAACUAIAEAAAAlACADAAAADQAgAQAAJAAwAgAAJQAgAwAAAA0AIAEAACQAMAIAACUAIAMAAAANACABAAAkADACAAAlACANAwAA2AIAIAQAANkCACCcAQEAAAABnwEBAAAAAaIBQAAAAAGjAUAAAAABrwEBAAAAAbABAgAAAAGyAQAAALIBArQBAAAAtAECtgEAAAC2AQK3AUAAAAABuAEBAAAAAQEWAAC4AQAgC5wBAQAAAAGfAQEAAAABogFAAAAAAaMBQAAAAAGvAQEAAAABsAECAAAAAbIBAAAAsgECtAEAAAC0AQK2AQAAALYBArcBQAAAAAG4AQEAAAABARYAALoBADABFgAAugEAMAEAAAAPACANAwAA1gIAIAQAANcCACCcAQEAwwIAIZ8BAQDDAgAhogFAAMYCACGjAUAAxgIAIa8BAQDFAgAhsAECAMQCACGyAQAA0gKyASK0AQAA0wK0ASK2AQAA1AK2ASK3AUAA1QIAIbgBAQDFAgAhAgAAACUAIBYAAL4BACALnAEBAMMCACGfAQEAwwIAIaIBQADGAgAhowFAAMYCACGvAQEAxQIAIbABAgDEAgAhsgEAANICsgEitAEAANMCtAEitgEAANQCtgEitwFAANUCACG4AQEAxQIAIQIAAAANACAWAADAAQAgAgAAAA0AIBYAAMABACABAAAADwAgAwAAACUAIB0AALgBACAeAAC-AQAgAQAAACUAIAEAAAANACAIDAAAzQIAICMAANACACAkAADPAgAgNQAAzgIAIDYAANECACCvAQAAvQIAILcBAAC9AgAguAEAAL0CACAOmQEAAPABADCaAQAAyAEAEJsBAADwAQAwnAEBAOIBACGfAQEA4gEAIaIBQADlAQAhowFAAOUBACGvAQEA5AEAIbABAgDjAQAhsgEAAPEBsgEitAEAAPIBtAEitgEAAPMBtgEitwFAAPQBACG4AQEA5AEAIQMAAAANACABAADHAQAwIgAAyAEAIAMAAAANACABAAAkADACAAAlACABAAAAGAAgAQAAABgAIAMAAAARACABAAAXADACAAAYACADAAAAEQAgAQAAFwAwAgAAGAAgAwAAABEAIAEAABcAMAIAABgAIAsDAADKAgAgBgAAywIAIAcAAMwCACCcAQEAAAABnQECAAAAAZ4BAQAAAAGfAQEAAAABoAEBAAAAAaEBAQAAAAGiAUAAAAABowFAAAAAAQEWAADQAQAgCJwBAQAAAAGdAQIAAAABngEBAAAAAZ8BAQAAAAGgAQEAAAABoQEBAAAAAaIBQAAAAAGjAUAAAAABARYAANIBADABFgAA0gEAMAsDAADHAgAgBgAAyAIAIAcAAMkCACCcAQEAwwIAIZ0BAgDEAgAhngEBAMUCACGfAQEAwwIAIaABAQDDAgAhoQEBAMMCACGiAUAAxgIAIaMBQADGAgAhAgAAABgAIBYAANUBACAInAEBAMMCACGdAQIAxAIAIZ4BAQDFAgAhnwEBAMMCACGgAQEAwwIAIaEBAQDDAgAhogFAAMYCACGjAUAAxgIAIQIAAAARACAWAADXAQAgAgAAABEAIBYAANcBACADAAAAGAAgHQAA0AEAIB4AANUBACABAAAAGAAgAQAAABEAIAYMAAC-AgAgIwAAwQIAICQAAMACACA1AAC_AgAgNgAAwgIAIJ4BAAC9AgAgC5kBAADhAQAwmgEAAN4BABCbAQAA4QEAMJwBAQDiAQAhnQECAOMBACGeAQEA5AEAIZ8BAQDiAQAhoAEBAOIBACGhAQEA4gEAIaIBQADlAQAhowFAAOUBACEDAAAAEQAgAQAA3QEAMCIAAN4BACADAAAAEQAgAQAAFwAwAgAAGAAgC5kBAADhAQAwmgEAAN4BABCbAQAA4QEAMJwBAQDiAQAhnQECAOMBACGeAQEA5AEAIZ8BAQDiAQAhoAEBAOIBACGhAQEA4gEAIaIBQADlAQAhowFAAOUBACEODAAA5wEAICMAAO8BACAkAADvAQAgpAEBAAAAAaUBAQAAAASmAQEAAAAEpwEBAAAAAagBAQAAAAGpAQEAAAABqgEBAAAAAasBAQDuAQAhrAEBAAAAAa0BAQAAAAGuAQEAAAABDQwAAOcBACAjAADnAQAgJAAA5wEAIDUAAO0BACA2AADnAQAgpAECAAAAAaUBAgAAAASmAQIAAAAEpwECAAAAAagBAgAAAAGpAQIAAAABqgECAAAAAasBAgDsAQAhDgwAAOoBACAjAADrAQAgJAAA6wEAIKQBAQAAAAGlAQEAAAAFpgEBAAAABacBAQAAAAGoAQEAAAABqQEBAAAAAaoBAQAAAAGrAQEA6QEAIawBAQAAAAGtAQEAAAABrgEBAAAAAQsMAADnAQAgIwAA6AEAICQAAOgBACCkAUAAAAABpQFAAAAABKYBQAAAAASnAUAAAAABqAFAAAAAAakBQAAAAAGqAUAAAAABqwFAAOYBACELDAAA5wEAICMAAOgBACAkAADoAQAgpAFAAAAAAaUBQAAAAASmAUAAAAAEpwFAAAAAAagBQAAAAAGpAUAAAAABqgFAAAAAAasBQADmAQAhCKQBAgAAAAGlAQIAAAAEpgECAAAABKcBAgAAAAGoAQIAAAABqQECAAAAAaoBAgAAAAGrAQIA5wEAIQikAUAAAAABpQFAAAAABKYBQAAAAASnAUAAAAABqAFAAAAAAakBQAAAAAGqAUAAAAABqwFAAOgBACEODAAA6gEAICMAAOsBACAkAADrAQAgpAEBAAAAAaUBAQAAAAWmAQEAAAAFpwEBAAAAAagBAQAAAAGpAQEAAAABqgEBAAAAAasBAQDpAQAhrAEBAAAAAa0BAQAAAAGuAQEAAAABCKQBAgAAAAGlAQIAAAAFpgECAAAABacBAgAAAAGoAQIAAAABqQECAAAAAaoBAgAAAAGrAQIA6gEAIQukAQEAAAABpQEBAAAABaYBAQAAAAWnAQEAAAABqAEBAAAAAakBAQAAAAGqAQEAAAABqwEBAOsBACGsAQEAAAABrQEBAAAAAa4BAQAAAAENDAAA5wEAICMAAOcBACAkAADnAQAgNQAA7QEAIDYAAOcBACCkAQIAAAABpQECAAAABKYBAgAAAASnAQIAAAABqAECAAAAAakBAgAAAAGqAQIAAAABqwECAOwBACEIpAEIAAAAAaUBCAAAAASmAQgAAAAEpwEIAAAAAagBCAAAAAGpAQgAAAABqgEIAAAAAasBCADtAQAhDgwAAOcBACAjAADvAQAgJAAA7wEAIKQBAQAAAAGlAQEAAAAEpgEBAAAABKcBAQAAAAGoAQEAAAABqQEBAAAAAaoBAQAAAAGrAQEA7gEAIawBAQAAAAGtAQEAAAABrgEBAAAAAQukAQEAAAABpQEBAAAABKYBAQAAAASnAQEAAAABqAEBAAAAAakBAQAAAAGqAQEAAAABqwEBAO8BACGsAQEAAAABrQEBAAAAAa4BAQAAAAEOmQEAAPABADCaAQAAyAEAEJsBAADwAQAwnAEBAOIBACGfAQEA4gEAIaIBQADlAQAhowFAAOUBACGvAQEA5AEAIbABAgDjAQAhsgEAAPEBsgEitAEAAPIBtAEitgEAAPMBtgEitwFAAPQBACG4AQEA5AEAIQcMAADnAQAgIwAA_AEAICQAAPwBACCkAQAAALIBAqUBAAAAsgEIpgEAAACyAQirAQAA-wGyASIHDAAA5wEAICMAAPoBACAkAAD6AQAgpAEAAAC0AQKlAQAAALQBCKYBAAAAtAEIqwEAAPkBtAEiBwwAAOcBACAjAAD4AQAgJAAA-AEAIKQBAAAAtgECpQEAAAC2AQimAQAAALYBCKsBAAD3AbYBIgsMAADqAQAgIwAA9gEAICQAAPYBACCkAUAAAAABpQFAAAAABaYBQAAAAAWnAUAAAAABqAFAAAAAAakBQAAAAAGqAUAAAAABqwFAAPUBACELDAAA6gEAICMAAPYBACAkAAD2AQAgpAFAAAAAAaUBQAAAAAWmAUAAAAAFpwFAAAAAAagBQAAAAAGpAUAAAAABqgFAAAAAAasBQAD1AQAhCKQBQAAAAAGlAUAAAAAFpgFAAAAABacBQAAAAAGoAUAAAAABqQFAAAAAAaoBQAAAAAGrAUAA9gEAIQcMAADnAQAgIwAA-AEAICQAAPgBACCkAQAAALYBAqUBAAAAtgEIpgEAAAC2AQirAQAA9wG2ASIEpAEAAAC2AQKlAQAAALYBCKYBAAAAtgEIqwEAAPgBtgEiBwwAAOcBACAjAAD6AQAgJAAA-gEAIKQBAAAAtAECpQEAAAC0AQimAQAAALQBCKsBAAD5AbQBIgSkAQAAALQBAqUBAAAAtAEIpgEAAAC0AQirAQAA-gG0ASIHDAAA5wEAICMAAPwBACAkAAD8AQAgpAEAAACyAQKlAQAAALIBCKYBAAAAsgEIqwEAAPsBsgEiBKQBAAAAsgECpQEAAACyAQimAQAAALIBCKsBAAD8AbIBIhCZAQAA_QEAMJoBAACwAQAQmwEAAP0BADCcAQEA4gEAIaABAQDiAQAhoQEBAOIBACGiAUAA5QEAIaMBQADlAQAhtgEAAP4BvgEiuQFAAOUBACG6AQEA5AEAIbsBAQDkAQAhvAEBAOQBACG-ASAA_wEAIb8BIAD_AQAhwAEBAOIBACEHDAAA5wEAICMAAIMCACAkAACDAgAgpAEAAAC-AQKlAQAAAL4BCKYBAAAAvgEIqwEAAIICvgEiBQwAAOcBACAjAACBAgAgJAAAgQIAIKQBIAAAAAGrASAAgAIAIQUMAADnAQAgIwAAgQIAICQAAIECACCkASAAAAABqwEgAIACACECpAEgAAAAAasBIACBAgAhBwwAAOcBACAjAACDAgAgJAAAgwIAIKQBAAAAvgECpQEAAAC-AQimAQAAAL4BCKsBAACCAr4BIgSkAQAAAL4BAqUBAAAAvgEIpgEAAAC-AQirAQAAgwK-ASIQmQEAAIQCADCaAQAAmgEAEJsBAACEAgAwnAEBAOIBACGhAQEA4gEAIaIBQADlAQAhowFAAOUBACG-ASAA_wEAIcEBAQDiAQAhwgEBAOQBACHDAQEA5AEAIcQBAgDjAQAhxQECAOMBACHGAQEA5AEAIccBIACFAgAhyAEBAOIBACEFDAAA6gEAICMAAIcCACAkAACHAgAgpAEgAAAAAasBIACGAgAhBQwAAOoBACAjAACHAgAgJAAAhwIAIKQBIAAAAAGrASAAhgIAIQKkASAAAAABqwEgAIcCACEJmQEAAIgCADCaAQAAhAEAEJsBAACIAgAwnAEBAOIBACGiAUAA5QEAIaMBQADlAQAhwgEBAOQBACHJAQEA4gEAIcoBAQDkAQAhCgsAAI0CACCZAQAAiQIAMJoBAABxABCbAQAAiQIAMJwBAQCKAgAhogFAAIwCACGjAUAAjAIAIcIBAQCLAgAhyQEBAIoCACHKAQEAiwIAIQukAQEAAAABpQEBAAAABKYBAQAAAASnAQEAAAABqAEBAAAAAakBAQAAAAGqAQEAAAABqwEBAO8BACGsAQEAAAABrQEBAAAAAa4BAQAAAAELpAEBAAAAAaUBAQAAAAWmAQEAAAAFpwEBAAAAAagBAQAAAAGpAQEAAAABqgEBAAAAAasBAQDrAQAhrAEBAAAAAa0BAQAAAAGuAQEAAAABCKQBQAAAAAGlAUAAAAAEpgFAAAAABKcBQAAAAAGoAUAAAAABqQFAAAAAAaoBQAAAAAGrAUAA6AEAIQPLAQAABQAgzAEAAAUAIM0BAAAFACALmQEAAI4CADCaAQAAawAQmwEAAI4CADCcAQEA4gEAIaEBAQDiAQAhogFAAOUBACGjAUAA5QEAIb4BIAD_AQAhzgECAOMBACHPAQEA4gEAIdABAQDiAQAhEZkBAACPAgAwmgEAAFUAEJsBAACPAgAwnAEBAOIBACGiAUAA5QEAIaMBQADlAQAhuAEBAOIBACG-ASAA_wEAIdEBAQDkAQAh0gECAOMBACHTAQIAkAIAIdQBAQDkAQAh1QEBAOQBACHWAQEA5AEAIdcBCACRAgAh2AECAOMBACHZAQIA4wEAIQ0MAADqAQAgIwAA6gEAICQAAOoBACA1AACUAgAgNgAA6gEAIKQBAgAAAAGlAQIAAAAFpgECAAAABacBAgAAAAGoAQIAAAABqQECAAAAAaoBAgAAAAGrAQIAkwIAIQ0MAADnAQAgIwAA7QEAICQAAO0BACA1AADtAQAgNgAA7QEAIKQBCAAAAAGlAQgAAAAEpgEIAAAABKcBCAAAAAGoAQgAAAABqQEIAAAAAaoBCAAAAAGrAQgAkgIAIQ0MAADnAQAgIwAA7QEAICQAAO0BACA1AADtAQAgNgAA7QEAIKQBCAAAAAGlAQgAAAAEpgEIAAAABKcBCAAAAAGoAQgAAAABqQEIAAAAAaoBCAAAAAGrAQgAkgIAIQ0MAADqAQAgIwAA6gEAICQAAOoBACA1AACUAgAgNgAA6gEAIKQBAgAAAAGlAQIAAAAFpgECAAAABacBAgAAAAGoAQIAAAABqQECAAAAAaoBAgAAAAGrAQIAkwIAIQikAQgAAAABpQEIAAAABaYBCAAAAAWnAQgAAAABqAEIAAAAAakBCAAAAAGqAQgAAAABqwEIAJQCACEWBAAAnQIAIAoAAJoCACALAACNAgAgDgAAmwIAIA8AAJwCACCZAQAAlQIAMJoBAAADABCbAQAAlQIAMJwBAQCKAgAhogFAAIwCACGjAUAAjAIAIbgBAQCKAgAhvgEgAJkCACHRAQEAiwIAIdIBAgCWAgAh0wECAJcCACHUAQEAiwIAIdUBAQCLAgAh1gEBAIsCACHXAQgAmAIAIdgBAgCWAgAh2QECAJYCACEIpAECAAAAAaUBAgAAAASmAQIAAAAEpwECAAAAAagBAgAAAAGpAQIAAAABqgECAAAAAasBAgDnAQAhCKQBAgAAAAGlAQIAAAAFpgECAAAABacBAgAAAAGoAQIAAAABqQECAAAAAaoBAgAAAAGrAQIA6gEAIQikAQgAAAABpQEIAAAABKYBCAAAAASnAQgAAAABqAEIAAAAAakBCAAAAAGqAQgAAAABqwEIAO0BACECpAEgAAAAAasBIACBAgAhA8sBAAAJACDMAQAACQAgzQEAAAkAIAPLAQAAEQAgzAEAABEAIM0BAAARACADywEAABoAIMwBAAAaACDNAQAAGgAgGQUAALQCACAHAACzAgAgDgAAmwIAIBAAAJoCACCZAQAAsAIAMJoBAAAPABCbAQAAsAIAMJwBAQCKAgAhogFAAIwCACGjAUAAjAIAIbYBAACyAuQBIrwBAQCLAgAhyQEBAIoCACHaAQEAigIAIdsBAQCKAgAh3AEBAIsCACHdAQEAiwIAId4BAQCLAgAh3wEBAIsCACHgAQEAiwIAIeIBAACxAuIBIuQBIACZAgAh5QEgAJkCACHnAQAADwAg6AEAAA8AIBOZAQAAngIAMJoBAAA9ABCbAQAAngIAMJwBAQDiAQAhogFAAOUBACGjAUAA5QEAIbYBAACgAuQBIrwBAQDkAQAhyQEBAOIBACHaAQEA4gEAIdsBAQDiAQAh3AEBAOQBACHdAQEA5AEAId4BAQDkAQAh3wEBAOQBACHgAQEA5AEAIeIBAACfAuIBIuQBIAD_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_ASAAmQIAIcABAQCKAgAhBKQBAAAAvgECpQEAAAC-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_wIAIO8BAACAAwAw8AEAAIIDADDxAQAAgwMAMAUdAACuBAAgHgAAtQQAIOkBAACvBAAg6gEAALQEACDtAQAAQAAgBR0AAKwEACAeAACyBAAg6QEAAK0EACDqAQAAsQQAIO0BAABuACAQBQAA7gIAIAYAAPACACAHAADxAgAgCAAA7wIAIJwBAQAAAAGgAQEAAAABoQEBAAAAAaIBQAAAAAGjAUAAAAABtgEAAAC-AQK5AUAAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvgEgAAAAAb8BIAAAAAECAAAACwAgHQAAhwMAIAMAAAALACAdAACHAwAgHgAAhgMAIAEWAACwBAAwFQUAALcCACAGAACdAgAgBwAArgIAIAgAALgCACAJAAC5AgAgmQEAALUCADCaAQAACQAQmwEAALUCADCcAQEAAAABoAEBAIoCACGhAQEAigIAIaIBQACMAgAhowFAAIwCACG2AQAAtgK-ASK5AUAAjAIAIboBAQCLAgAhuwEBAIsCACG8AQEAiwIAIb4BIACZAgAhvwEgAJkCACHAAQEAigIAIQIAAAALACAWAACGAwAgAgAAAIQDACAWAACFAwAgEJkBAACDAwAwmgEAAIQDABCbAQAAgwMAMJwBAQCKAgAhoAEBAIoCACGhAQEAigIAIaIBQACMAgAhowFAAIwCACG2AQAAtgK-ASK5AUAAjAIAIboBAQCLAgAhuwEBAIsCACG8AQEAiwIAIb4BIACZAgAhvwEgAJkCACHAAQEAigIAIRCZAQAAgwMAMJoBAACEAwAQmwEAAIMDADCcAQEAigIAIaABAQCKAgAhoQEBAIoCACGiAUAAjAIAIaMBQACMAgAhtgEAALYCvgEiuQFAAIwCACG6AQEAiwIAIbsBAQCLAgAhvAEBAIsCACG-ASAAmQIAIb8BIACZAgAhwAEBAIoCACEMnAEBAMMCACGgAQEAwwIAIaEBAQDDAgAhogFAAMYCACGjAUAAxgIAIbYBAADdAr4BIrkBQADGAgAhugEBAMUCACG7AQEAxQIAIbwBAQDFAgAhvgEgAN4CACG_ASAA3gIAIRAFAADfAgAgBgAA4QIAIAcAAOICACAIAADgAgAgnAEBAMMCACGgAQEAwwIAIaEBAQDDAgAhogFAAMYCACGjAUAAxgIAIbYBAADdAr4BIrkBQADGAgAhugEBAMUCACG7AQEAxQIAIbwBAQDFAgAhvgEgAN4CACG_ASAA3gIAIRAFAADuAgAgBgAA8AIAIAcAAPECACAIAADvAgAgnAEBAAAAAaABAQAAAAGhAQEAAAABogFAAAAAAaMBQAAAAAG2AQAAAL4BArkBQAAAAAG6AQEAAAABuwEBAAAAAbwBAQAAAAG-ASAAAAABvwEgAAAAAQQdAAD8AgAw6QEAAP0CADDtAQAAgAMAMO4BAAD_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_ASAAAAABwAEBAAAAAQIAAAALACAdAADQAwAgAwAAAAsAIB0AANADACAeAADPAwAgARYAAKAEADACAAAACwAgFgAAzwMAIAIAAACEAwAgFgAAzgMAIAycAQEAwwIAIaABAQDDAgAhogFAAMYCACGjAUAAxgIAIbYBAADdAr4BIrkBQADGAgAhugEBAMUCACG7AQEAxQIAIbwBAQDFAgAhvgEgAN4CACG_ASAA3gIAIcABAQDDAgAhEAUAAN8CACAGAADhAgAgCAAA4AIAIAkAAOMCACCcAQEAwwIAIaABAQDDAgAhogFAAMYCACGjAUAAxgIAIbYBAADdAr4BIrkBQADGAgAhugEBAMUCACG7AQEAxQIAIbwBAQDFAgAhvgEgAN4CACG_ASAA3gIAIcABAQDDAgAhEAUAAO4CACAGAADwAgAgCAAA7wIAIAkAAPICACCcAQEAAAABoAEBAAAAAaIBQAAAAAGjAUAAAAABtgEAAAC-AQK5AUAAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvgEgAAAAAb8BIAAAAAHAAQEAAAABDgoAAIgDACANAACKAwAgnAEBAAAAAaIBQAAAAAGjAUAAAAABvgEgAAAAAcEBAQAAAAHCAQEAAAABwwEBAAAAAcQBAgAAAAHFAQIAAAABxgEBAAAAAccBIAAAAAHIAQEAAAABAgAAAAcAIB0AANkDACADAAAABwAgHQAA2QMAIB4AANgDACABFgAAnwQAMAIAAAAHACAWAADYAwAgAgAAAJcDACAWAADXAwAgDJwBAQDDAgAhogFAAMYCACGjAUAAxgIAIb4BIADeAgAhwQEBAMMCACHCAQEAxQIAIcMBAQDFAgAhxAECAMQCACHFAQIAxAIAIcYBAQDFAgAhxwEgAPgCACHIAQEAwwIAIQ4KAAD5AgAgDQAA-wIAIJwBAQDDAgAhogFAAMYCACGjAUAAxgIAIb4BIADeAgAhwQEBAMMCACHCAQEAxQIAIcMBAQDFAgAhxAECAMQCACHFAQIAxAIAIcYBAQDFAgAhxwEgAPgCACHIAQEAwwIAIQ4KAACIAwAgDQAAigMAIJwBAQAAAAGiAUAAAAABowFAAAAAAb4BIAAAAAHBAQEAAAABwgEBAAAAAcMBAQAAAAHEAQIAAAABxQECAAAAAcYBAQAAAAHHASAAAAAByAEBAAAAAQQdAADRAwAw6QEAANIDADDtAQAAkwMAMO4BAADUAwAgBB0AAMgDADDpAQAAyQMAMO0BAACAAwAw7gEAAMsDACAEHQAAvAMAMOkBAAC9AwAw7QEAAMADADDuAQAAvwMAIAQdAACwAwAw6QEAALEDADDtAQAAtAMAMO4BAACzAwAgAx0AAJ0EACDpAQAAngQAIO0BAAABACAAAAAKBQAAlAQAIAcAAJMEACAOAADgAwAgEAAA3wMAILwBAAC9AgAg3AEAAL0CACDdAQAAvQIAIN4BAAC9AgAg3wEAAL0CACDgAQAAvQIAIAAAAAHvAQAAAOIBAgHvAQAAAOQBAgcdAACKBAAgHgAAjQQAIOkBAACLBAAg6gEAAIwEACDrAQAAAwAg7AEAAAMAIO0BAABAACALHQAAgQQAMB4AAIUEADDpAQAAggQAMOoBAACDBAAw6wEAAIADADDsAQAAgAMAMO0BAACAAwAw7gEAAIQEACDvAQAAgAMAMPABAACGBAAw8QEAAIMDADALHQAA-AMAMB4AAPwDADDpAQAA-QMAMOoBAAD6AwAw6wEAAMADADDsAQAAwAMAMO0BAADAAwAw7gEAAPsDACDvAQAAwAMAMPABAAD9AwAw8QEAAMMDADALHQAA7AMAMB4AAPEDADDpAQAA7QMAMOoBAADuAwAw6wEAAPADADDsAQAA8AMAMO0BAADwAwAw7gEAAO8DACDvAQAA8AMAMPABAADyAwAw8QEAAPMDADALAwAA2AIAIJwBAQAAAAGfAQEAAAABogFAAAAAAaMBQAAAAAGvAQEAAAABsAECAAAAAbIBAAAAsgECtAEAAAC0AQK2AQAAALYBArcBQAAAAAECAAAAJQAgHQAA9wMAIAMAAAAlACAdAAD3AwAgHgAA9gMAIAEWAACcBAAwEAMAAKoCACAEAACrAgAgmQEAAKUCADCaAQAADQAQmwEAAKUCADCcAQEAAAABnwEBAAAAAaIBQACMAgAhowFAAIwCACGvAQEAAAABsAECAJYCACGyAQAApgKyASK0AQAApwK0ASK2AQAAqAK2ASK3AUAAqQIAIbgBAQCLAgAhAgAAACUAIBYAAPYDACACAAAA9AMAIBYAAPUDACAOmQEAAPMDADCaAQAA9AMAEJsBAADzAwAwnAEBAIoCACGfAQEAigIAIaIBQACMAgAhowFAAIwCACGvAQEAiwIAIbABAgCWAgAhsgEAAKYCsgEitAEAAKcCtAEitgEAAKgCtgEitwFAAKkCACG4AQEAiwIAIQ6ZAQAA8wMAMJoBAAD0AwAQmwEAAPMDADCcAQEAigIAIZ8BAQCKAgAhogFAAIwCACGjAUAAjAIAIa8BAQCLAgAhsAECAJYCACGyAQAApgKyASK0AQAApwK0ASK2AQAAqAK2ASK3AUAAqQIAIbgBAQCLAgAhCpwBAQDDAgAhnwEBAMMCACGiAUAAxgIAIaMBQADGAgAhrwEBAMUCACGwAQIAxAIAIbIBAADSArIBIrQBAADTArQBIrYBAADUArYBIrcBQADVAgAhCwMAANYCACCcAQEAwwIAIZ8BAQDDAgAhogFAAMYCACGjAUAAxgIAIa8BAQDFAgAhsAECAMQCACGyAQAA0gKyASK0AQAA0wK0ASK2AQAA1AK2ASK3AUAA1QIAIQsDAADYAgAgnAEBAAAAAZ8BAQAAAAGiAUAAAAABowFAAAAAAa8BAQAAAAGwAQIAAAABsgEAAACyAQK0AQAAALQBArYBAAAAtgECtwFAAAAAAQkDAADKAgAgBwAAzAIAIJwBAQAAAAGdAQIAAAABngEBAAAAAZ8BAQAAAAGhAQEAAAABogFAAAAAAaMBQAAAAAECAAAAGAAgHQAAgAQAIAMAAAAYACAdAACABAAgHgAA_wMAIAEWAACbBAAwAgAAABgAIBYAAP8DACACAAAAxAMAIBYAAP4DACAHnAEBAMMCACGdAQIAxAIAIZ4BAQDFAgAhnwEBAMMCACGhAQEAwwIAIaIBQADGAgAhowFAAMYCACEJAwAAxwIAIAcAAMkCACCcAQEAwwIAIZ0BAgDEAgAhngEBAMUCACGfAQEAwwIAIaEBAQDDAgAhogFAAMYCACGjAUAAxgIAIQkDAADKAgAgBwAAzAIAIJwBAQAAAAGdAQIAAAABngEBAAAAAZ8BAQAAAAGhAQEAAAABogFAAAAAAaMBQAAAAAEQBQAA7gIAIAcAAPECACAIAADvAgAgCQAA8gIAIJwBAQAAAAGhAQEAAAABogFAAAAAAaMBQAAAAAG2AQAAAL4BArkBQAAAAAG6AQEAAAABuwEBAAAAAbwBAQAAAAG-ASAAAAABvwEgAAAAAcABAQAAAAECAAAACwAgHQAAiQQAIAMAAAALACAdAACJBAAgHgAAiAQAIAEWAACaBAAwAgAAAAsAIBYAAIgEACACAAAAhAMAIBYAAIcEACAMnAEBAMMCACGhAQEAwwIAIaIBQADGAgAhowFAAMYCACG2AQAA3QK-ASK5AUAAxgIAIboBAQDFAgAhuwEBAMUCACG8AQEAxQIAIb4BIADeAgAhvwEgAN4CACHAAQEAwwIAIRAFAADfAgAgBwAA4gIAIAgAAOACACAJAADjAgAgnAEBAMMCACGhAQEAwwIAIaIBQADGAgAhowFAAMYCACG2AQAA3QK-ASK5AUAAxgIAIboBAQDFAgAhuwEBAMUCACG8AQEAxQIAIb4BIADeAgAhvwEgAN4CACHAAQEAwwIAIRAFAADuAgAgBwAA8QIAIAgAAO8CACAJAADyAgAgnAEBAAAAAaEBAQAAAAGiAUAAAAABowFAAAAAAbYBAAAAvgECuQFAAAAAAboBAQAAAAG7AQEAAAABvAEBAAAAAb4BIAAAAAG_ASAAAAABwAEBAAAAAREKAADbAwAgCwAA2gMAIA4AANwDACAPAADdAwAgnAEBAAAAAaIBQAAAAAGjAUAAAAABvgEgAAAAAdEBAQAAAAHSAQIAAAAB0wECAAAAAdQBAQAAAAHVAQEAAAAB1gEBAAAAAdcBCAAAAAHYAQIAAAAB2QECAAAAAQIAAABAACAdAACKBAAgAwAAAAMAIB0AAIoEACAeAACOBAAgEwAAAAMAIAoAAKwDACALAACrAwAgDgAArQMAIA8AAK4DACAWAACOBAAgnAEBAMMCACGiAUAAxgIAIaMBQADGAgAhvgEgAN4CACHRAQEAxQIAIdIBAgDEAgAh0wECAKkDACHUAQEAxQIAIdUBAQDFAgAh1gEBAMUCACHXAQgAqgMAIdgBAgDEAgAh2QECAMQCACERCgAArAMAIAsAAKsDACAOAACtAwAgDwAArgMAIJwBAQDDAgAhogFAAMYCACGjAUAAxgIAIb4BIADeAgAh0QEBAMUCACHSAQIAxAIAIdMBAgCpAwAh1AEBAMUCACHVAQEAxQIAIdYBAQDFAgAh1wEIAKoDACHYAQIAxAIAIdkBAgDEAgAhAx0AAIoEACDpAQAAiwQAIO0BAABAACAEHQAAgQQAMOkBAACCBAAw7QEAAIADADDuAQAAhAQAIAQdAAD4AwAw6QEAAPkDADDtAQAAwAMAMO4BAAD7AwAgBB0AAOwDADDpAQAA7QMAMO0BAADwAwAw7gEAAO8DACAKBAAA4gMAIAoAAN8DACALAACcAwAgDgAA4AMAIA8AAOEDACDRAQAAvQIAINMBAAC9AgAg1AEAAL0CACDVAQAAvQIAINYBAAC9AgAgAAgFAACWBAAgBgAA4gMAIAcAAJMEACAIAACXBAAgCQAAmAQAILoBAAC9AgAguwEAAL0CACC8AQAAvQIAIAUDAACVBAAgBAAA4gMAIK8BAAC9AgAgtwEAAL0CACC4AQAAvQIAIAQDAACVBAAgBgAA4gMAIAcAAJMEACCeAQAAvQIAIAcHAACTBAAgCgAA3wMAIA0AAJkEACDCAQAAvQIAIMMBAAC9AgAgxgEAAL0CACDHAQAAvQIAIAMLAACcAwAgwgEAAL0CACDKAQAAvQIAIAycAQEAAAABoQEBAAAAAaIBQAAAAAGjAUAAAAABtgEAAAC-AQK5AUAAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvgEgAAAAAb8BIAAAAAHAAQEAAAABB5wBAQAAAAGdAQIAAAABngEBAAAAAZ8BAQAAAAGhAQEAAAABogFAAAAAAaMBQAAAAAEKnAEBAAAAAZ8BAQAAAAGiAUAAAAABowFAAAAAAa8BAQAAAAGwAQIAAAABsgEAAACyAQK0AQAAALQBArYBAAAAtgECtwFAAAAAARMFAACSBAAgDgAAkQQAIBAAAJAEACCcAQEAAAABogFAAAAAAaMBQAAAAAG2AQAAAOQBArwBAQAAAAHJAQEAAAAB2gEBAAAAAdsBAQAAAAHcAQEAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4AEBAAAAAeIBAAAA4gEC5AEgAAAAAeUBIAAAAAECAAAAAQAgHQAAnQQAIAycAQEAAAABogFAAAAAAaMBQAAAAAG-ASAAAAABwQEBAAAAAcIBAQAAAAHDAQEAAAABxAECAAAAAcUBAgAAAAHGAQEAAAABxwEgAAAAAcgBAQAAAAEMnAEBAAAAAaABAQAAAAGiAUAAAAABowFAAAAAAbYBAAAAvgECuQFAAAAAAboBAQAAAAG7AQEAAAABvAEBAAAAAb4BIAAAAAG_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_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_ASAA3gIAIcABAQDDAgAhEgQAAN4DACAKAADbAwAgCwAA2gMAIA8AAN0DACCcAQEAAAABogFAAAAAAaMBQAAAAAG4AQEAAAABvgEgAAAAAdEBAQAAAAHSAQIAAAAB0wECAAAAAdQBAQAAAAHVAQEAAAAB1gEBAAAAAdcBCAAAAAHYAQIAAAAB2QECAAAAAQIAAABAACAdAADQBAAgEwUAAJIEACAHAACPBAAgEAAAkAQAIJwBAQAAAAGiAUAAAAABowFAAAAAAbYBAAAA5AECvAEBAAAAAckBAQAAAAHaAQEAAAAB2wEBAAAAAdwBAQAAAAHdAQEAAAAB3gEBAAAAAd8BAQAAAAHgAQEAAAAB4gEAAADiAQLkASAAAAAB5QEgAAAAAQIAAAABACAdAADSBAAgEQUAAO4CACAGAADwAgAgBwAA8QIAIAkAAPICACCcAQEAAAABoAEBAAAAAaEBAQAAAAGiAUAAAAABowFAAAAAAbYBAAAAvgECuQFAAAAAAboBAQAAAAG7AQEAAAABvAEBAAAAAb4BIAAAAAG_ASAAAAABwAEBAAAAAQIAAAALACAdAADUBAAgAwAAAAMAIB0AANAEACAeAADYBAAgFAAAAAMAIAQAAK8DACAKAACsAwAgCwAAqwMAIA8AAK4DACAWAADYBAAgnAEBAMMCACGiAUAAxgIAIaMBQADGAgAhuAEBAMMCACG-ASAA3gIAIdEBAQDFAgAh0gECAMQCACHTAQIAqQMAIdQBAQDFAgAh1QEBAMUCACHWAQEAxQIAIdcBCACqAwAh2AECAMQCACHZAQIAxAIAIRIEAACvAwAgCgAArAMAIAsAAKsDACAPAACuAwAgnAEBAMMCACGiAUAAxgIAIaMBQADGAgAhuAEBAMMCACG-ASAA3gIAIdEBAQDFAgAh0gECAMQCACHTAQIAqQMAIdQBAQDFAgAh1QEBAMUCACHWAQEAxQIAIdcBCACqAwAh2AECAMQCACHZAQIAxAIAIQMAAAAPACAdAADSBAAgHgAA2wQAIBUAAAAPACAFAADrAwAgBwAA6AMAIBAAAOkDACAWAADbBAAgnAEBAMMCACGiAUAAxgIAIaMBQADGAgAhtgEAAOcD5AEivAEBAMUCACHJAQEAwwIAIdoBAQDDAgAh2wEBAMMCACHcAQEAxQIAId0BAQDFAgAh3gEBAMUCACHfAQEAxQIAIeABAQDFAgAh4gEAAOYD4gEi5AEgAN4CACHlASAA3gIAIRMFAADrAwAgBwAA6AMAIBAAAOkDACCcAQEAwwIAIaIBQADGAgAhowFAAMYCACG2AQAA5wPkASK8AQEAxQIAIckBAQDDAgAh2gEBAMMCACHbAQEAwwIAIdwBAQDFAgAh3QEBAMUCACHeAQEAxQIAId8BAQDFAgAh4AEBAMUCACHiAQAA5gPiASLkASAA3gIAIeUBIADeAgAhAwAAAAkAIB0AANQEACAeAADeBAAgEwAAAAkAIAUAAN8CACAGAADhAgAgBwAA4gIAIAkAAOMCACAWAADeBAAgnAEBAMMCACGgAQEAwwIAIaEBAQDDAgAhogFAAMYCACGjAUAAxgIAIbYBAADdAr4BIrkBQADGAgAhugEBAMUCACG7AQEAxQIAIbwBAQDFAgAhvgEgAN4CACG_ASAA3gIAIcABAQDDAgAhEQUAAN8CACAGAADhAgAgBwAA4gIAIAkAAOMCACCcAQEAwwIAIaABAQDDAgAhoQEBAMMCACGiAUAAxgIAIaMBQADGAgAhtgEAAN0CvgEiuQFAAMYCACG6AQEAxQIAIbsBAQDFAgAhvAEBAMUCACG-ASAA3gIAIb8BIADeAgAhwAEBAMMCACEFBSYFBwQCDAAMDiMGECIEBgQAAQoWBAsIAwwACw4ZBg8dCgQHAAIKDAQMAAkNAAcFBQ4FBgABBwACCBIGCQADAgMABAQQAQMDAAQGAAEHAAICCxMDDAAIAQsUAAEKFQABBwACBAofAAseAA4gAA8hAAMFKQAOKAAQJwAAAAADDAARIwASJAATAAAAAwwAESMAEiQAEwEEAAEBBAABBQwAGCMAGyQAHDUAGTYAGgAAAAAABQwAGCMAGyQAHDUAGTYAGgEHAAIBBwACBQwAISMAJCQAJTUAIjYAIwAAAAAABQwAISMAJCQAJTUAIjYAIwAAAwwAKiMAKyQALAAAAAMMACojACskACwCBwACDQAHAgcAAg0ABwUMADEjADQkADU1ADI2ADMAAAAAAAUMADEjADQkADU1ADI2ADMDBgABBwACCQADAwYAAQcAAgkAAwMMADojADskADwAAAADDAA6IwA7JAA8AgMABAS9AQECAwAEBMMBAQUMAEEjAEQkAEU1AEI2AEMAAAAAAAUMAEEjAEQkAEU1AEI2AEMDAwAEBgABBwACAwMABAYAAQcAAgUMAEojAE0kAE41AEs2AEwAAAAAAAUMAEojAE0kAE41AEs2AEwRAgESKgETLAEULQEVLgEXMAEYMg0ZMw4aNQEbNw0cOA8fOQEgOgEhOw0lPhAmPxQnQQIoQgIpRAIqRQIrRgIsSAItSg0uSxUvTQIwTw0xUBYyUQIzUgI0Uw03Vhc4Vx05WAo6WQo7Wgo8Wwo9XAo-Xgo_YA1AYR5BYwpCZQ1DZh9EZwpFaApGaQ1HbCBIbSZJbwdKcAdLcwdMdAdNdQdOdwdPeQ1QeidRfAdSfg1TfyhUgAEHVYEBB1aCAQ1XhQEpWIYBLVmHAQNaiAEDW4kBA1yKAQNdiwEDXo0BA1-PAQ1gkAEuYZIBA2KUAQ1jlQEvZJYBA2WXAQNmmAENZ5sBMGicATZpnQEEap4BBGufAQRsoAEEbaEBBG6jAQRvpQENcKYBN3GoAQRyqgENc6sBOHSsAQR1rQEEdq4BDXexATl4sgE9ebMBBXq0AQV7tQEFfLYBBX23AQV-uQEFf7sBDYABvAE-gQG_AQWCAcEBDYMBwgE_hAHEAQWFAcUBBYYBxgENhwHJAUCIAcoBRokBywEGigHMAQaLAc0BBowBzgEGjQHPAQaOAdEBBo8B0wENkAHUAUeRAdYBBpIB2AENkwHZAUiUAdoBBpUB2wEGlgHcAQ2XAd8BSZgB4AFP"
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
  isActive: "isActive",
  isBanned: "isBanned",
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
  isAvailable: "isAvailable",
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
  image: "image",
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
  address: "address",
  status: "status",
  isAvailable: "isAvailable",
  isBooked: "isBooked",
  customerId: "customerId",
  technicianId: "technicianId",
  serviceId: "serviceId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  transactionId: "transactionId",
  amount: "amount",
  provider: "provider",
  method: "method",
  status: "status",
  paidAt: "paidAt",
  bookingId: "bookingId",
  userId: "userId",
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
      bio: payload.bio,
      experience: payload.experience,
      hourlyRate: payload.hourlyRate,
      skills: payload.skills,
      nationalId: payload.nationalId,
      certification: payload.certification,
      userId,
      availability: payload.availability ? {
        create: payload.availability.map((slot) => ({
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime
        }))
      } : void 0
    }
  });
  return result;
};
var updateAvailability = async (userId, payload) => {
  const { isAvailable, slots } = payload;
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId
    }
  });
  if (!technician) {
    throw new Error("Technician profile not found");
  }
  return prisma.$transaction(async (tx) => {
    await tx.technicianProfile.update({
      where: {
        id: technician.id
      },
      data: {
        isAvailable
      }
    });
    await tx.availabilitySlot.deleteMany({
      where: {
        technicianId: technician.id
      }
    });
    if (slots && slots.length > 0) {
      await tx.availabilitySlot.createMany({
        data: slots.map((slot) => ({
          technicianId: technician.id,
          dayOfWeek: Number(slot.dayOfWeek),
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: slot.isAvailable ?? true
        }))
      });
    }
    return tx.technicianProfile.findUnique({
      where: {
        id: technician.id
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
          address: true,
          city: true,
          district: true,
          status: true,
          isActive: true
        }
      },
      availability: true,
      services: {
        where: {
          isAvailable: true
        },
        include: {
          category: true
        },
        orderBy: {
          createdAt: "desc"
        }
      },
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
      },
      _count: {
        select: {
          services: true,
          bookings: true,
          reviews: true
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
  const { availability, ...technicianData } = payload;
  return prisma.$transaction(async (tx) => {
    await tx.technicianProfile.update({
      where: {
        userId
      },
      data: {
        ...technicianData
      }
    });
    if (availability) {
      await tx.availabilitySlot.deleteMany({
        where: {
          technicianId: technician.id
        }
      });
      if (availability.length > 0) {
        await tx.availabilitySlot.createMany({
          data: availability.map((slot) => ({
            technicianId: technician.id,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable ?? true
          }))
        });
      }
    }
    return tx.technicianProfile.findUnique({
      where: {
        userId
      },
      include: {
        user: true,
        availability: true
      }
    });
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
    include: {
      technician: true
    }
    // select: {
    //     id: true,
    //     name: true,
    //     email: true,
    //     phone: true,
    //     profileImage: true,
    //     role: true,
    //     status: true,
    //     createdAt: true,
    // },
  });
};
var updateUserStatus = async (id, status) => {
  const isBanned = status === "BLOCKED";
  return prisma.users.update({
    where: {
      id
    },
    data: {
      status,
      isBanned
    },
    omit: {
      password: true,
      profileImage: true
    }
  });
};
var getAllBookings = async (query) => {
  const {
    page = "1",
    limit = "10",
    searchTerm = ""
  } = query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const whereCondition = {
    ...searchTerm && {
      OR: [
        {
          customer: {
            name: {
              contains: searchTerm,
              mode: "insensitive"
            }
          }
        },
        {
          customer: {
            email: {
              contains: searchTerm,
              mode: "insensitive"
            }
          }
        },
        {
          technician: {
            user: {
              name: {
                contains: searchTerm,
                mode: "insensitive"
              }
            }
          }
        },
        {
          service: {
            title: {
              contains: searchTerm,
              mode: "insensitive"
            }
          }
        }
        // ...(isNaN(Number(searchTerm))
        //     ? []
        //     : [
        //         {
        //             totalPrice: Number(searchTerm),
        //         },
        //     ]),
      ]
    }
  };
  const [bookings, total] = await prisma.$transaction([
    prisma.booking.findMany({
      where: whereCondition,
      skip,
      take: limitNumber,
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
    }),
    prisma.booking.count({
      where: whereCondition
    })
  ]);
  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber)
    },
    data: bookings
  };
};
var createCategory = async (payload) => {
  return prisma.category.createMany({
    data: payload
  });
};
var getAllCategories = async (query) => {
  const {
    page = "1",
    limit = "10",
    searchTerm = ""
  } = query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const whereCondition = {
    ...searchTerm && {
      OR: [
        {
          name: {
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
    }
  };
  const [categories, total] = await prisma.$transaction([
    prisma.category.findMany({
      where: whereCondition,
      skip,
      take: limitNumber,
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.category.count({
      where: whereCondition
    })
  ]);
  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber)
    },
    data: categories
  };
};
var getAllService = async (query) => {
  const {
    page = "1",
    limit = "10",
    searchTerm = ""
  } = query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const whereCondition = {
    isAvailable: true,
    ...searchTerm && {
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
        },
        {
          category: {
            name: {
              contains: searchTerm,
              mode: "insensitive"
            }
          }
        },
        {
          technician: {
            user: {
              name: {
                contains: searchTerm,
                mode: "insensitive"
              }
            }
          }
        },
        ...isNaN(Number(searchTerm)) ? [] : [
          {
            price: Number(searchTerm)
          }
        ]
      ]
    }
  };
  const [services, total] = await prisma.$transaction([
    prisma.service.findMany({
      where: whereCondition,
      skip,
      take: limitNumber,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        technician: {
          select: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.service.count({
      where: whereCondition
    })
  ]);
  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber)
    },
    data: services
  };
};
var getAllTechnicians3 = async (query) => {
  const {
    page = "1",
    limit = "10",
    searchTerm = ""
  } = query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const whereCondition = {
    isAvailable: true,
    ...searchTerm && {
      OR: [
        {
          skills: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          bio: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          user: {
            is: {
              name: {
                contains: searchTerm,
                mode: "insensitive"
              }
            }
          }
        },
        ...isNaN(Number(searchTerm)) ? [] : [
          {
            hourlyRate: Number(searchTerm)
          }
        ]
      ]
    }
  };
  const [technicians, total] = await prisma.$transaction([
    prisma.technicianProfile.findMany({
      where: whereCondition,
      skip,
      take: limitNumber,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profileImage: true,
            role: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            services: true,
            bookings: true,
            reviews: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.technicianProfile.count({
      where: whereCondition
    })
  ]);
  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber)
    },
    data: technicians
  };
};
var getDashboardOverview = async () => {
  const [
    totalUsers,
    totalTechnicians,
    totalBookings,
    totalRevenue,
    pendingBookings,
    activeTechnicians,
    recentBookings
  ] = await prisma.$transaction([
    prisma.users.count(),
    prisma.technicianProfile.count(),
    prisma.booking.count(),
    prisma.payment.aggregate({
      where: {
        status: "COMPLETED"
      },
      _sum: {
        amount: true
      }
    }),
    prisma.booking.count({
      where: {
        status: BookingStatus.REQUESTED
      }
    }),
    prisma.technicianProfile.count({
      where: {
        isAvailable: true
      }
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        customer: {
          select: {
            name: true
          }
        },
        service: {
          select: {
            title: true,
            price: true
          }
        }
      }
    })
  ]);
  return {
    overview: {
      totalUsers,
      totalTechnicians,
      totalBookings,
      totalRevenue: totalRevenue._sum.amount ?? 0,
      pendingBookings,
      activeTechnicians
    },
    recentBookings
  };
};
var adminService = {
  getAllUsers,
  getAllBookings,
  updateUserStatus,
  getAllCategories,
  createCategory,
  getAllService,
  getAllTechnicians: getAllTechnicians3,
  getDashboardOverview
};

// src/modules/admin/ admin.controller.ts
var getAllUsers2 = catchAsync(async (req, res, next) => {
  const result = await adminService.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Users retrieved successfully",
    data: result
  });
});
var updateUserStatus2 = catchAsync(async (req, res, next) => {
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
var getAllBookings2 = catchAsync(async (req, res, next) => {
  const result = await adminService.getAllBookings(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Bookings retrieved successfully",
    data: result
  });
});
var getAllCategories2 = catchAsync(async (req, res, next) => {
  const result = await adminService.getAllCategories(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Categories retrieved successfully",
    data: result
  });
});
var createCategory2 = catchAsync(async (req, res, next) => {
  const result = await adminService.createCategory(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.CREATED,
    message: "Category created successfully",
    data: result
  });
});
var getAllServices = catchAsync(async (req, res, next) => {
  const result = await adminService.getAllService(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Services retrieved successfully",
    data: result
  });
});
var getAllTechnicians4 = catchAsync(async (req, res, next) => {
  const result = await adminService.getAllTechnicians(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Technicians retrieved successfully",
    data: result
  });
});
var getDashboardOverview2 = catchAsync(async (req, res) => {
  const result = await adminService.getDashboardOverview();
  sendResponse(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Dashboard overview retrieved successfully",
    data: result
  });
});
var AdminController = {
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  getAllBookings: getAllBookings2,
  getAllCategories: getAllCategories2,
  createCategory: createCategory2,
  getAllServices,
  getAllTechnicians: getAllTechnicians4,
  getDashboardOverview: getDashboardOverview2
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
router4.get(
  "/services",
  auth(UserRole.ADMIN),
  AdminController.getAllServices
);
router4.get(
  "/technician",
  auth(UserRole.ADMIN),
  AdminController.getAllTechnicians
);
router4.get(
  "/dashboard",
  auth("ADMIN"),
  AdminController.getDashboardOverview
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
      bookingTime: payload.bookingTime,
      address: payload.address,
      note: payload.note,
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
  return prisma.service.createMany({
    data: payload
  });
};
var getAllServices2 = async (query) => {
  const {
    category,
    location,
    rating,
    searchTerm,
    minPrice,
    maxPrice,
    page = "1",
    limit = "9",
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
  if (category) {
    andConditions.push({
      category: {
        name: {
          equals: category,
          mode: "insensitive"
        }
      }
    });
  }
  if (location) {
    andConditions.push({
      technician: {
        user: {
          city: {
            equals: location,
            mode: "insensitive"
          }
        }
      }
    });
  }
  if (rating) {
    andConditions.push({
      bookings: {
        some: {
          review: {
            is: {
              rating: {
                equals: Number(rating)
              }
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
  let orderBy;
  switch (sortBy) {
    case "price":
      orderBy = {
        price: sortOrder
      };
      break;
    case "rating":
      orderBy = {
        technician: {
          averageRating: "desc"
        }
      };
      break;
    default:
      orderBy = {
        createdAt: sortOrder
      };
  }
  const result = await prisma.service.findMany({
    where: whereConditions,
    skip,
    take: limitNumber,
    orderBy,
    // orderBy: {
    //     [sortBy]: sortOrder as Prisma.SortOrder,
    // },
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
var getSingleService = async (serviceId) => {
  const getSingleService2 = await prisma.service.findUnique({
    where: {
      id: serviceId
    },
    include: {
      category: true,
      technician: {
        select: {
          id: true,
          bio: true,
          experience: true,
          hourlyRate: true,
          skills: true,
          certification: true,
          averageRating: true,
          totalReviews: true,
          completedJobs: true,
          availability: true,
          user: { select: { id: true, name: true, profileImage: true } }
        }
      },
      bookings: {
        where: {
          isAvailable: true
        }
      }
    }
  });
  return getSingleService2;
};
var ServiceServices = {
  createService,
  getAllServices: getAllServices2,
  getSingleService
};

// src/modules/services/service.controller.ts
import httpStatus7 from "http-status";
var createService2 = catchAsync(async (req, res, next) => {
  const result = await ServiceServices.createService(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Service created successfully",
    data: result
  });
});
var getAllServices3 = catchAsync(async (req, res, next) => {
  const result = await ServiceServices.getAllServices(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus7.OK,
    message: "Services retrieved successfully",
    data: result
  });
});
var getSingleServiceById = catchAsync(async (req, res, next) => {
  const serviceId = req.params.id;
  const getServiceDetails = await ServiceServices.getSingleService(serviceId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus7.OK,
    message: "Service Details patched successfully",
    data: getServiceDetails
  });
});
var ServiceControllers = {
  createService: createService2,
  getSingleServiceById,
  getAllServices: getAllServices3
};

// src/modules/services/service.route.ts
var router6 = Router5();
router6.post("/", auth(UserRole.ADMIN), ServiceControllers.createService);
router6.get("/", ServiceControllers.getAllServices);
router6.get("/:id", ServiceControllers.getSingleServiceById);
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
  if (booking.payments) {
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