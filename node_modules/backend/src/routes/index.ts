import { Router } from 'express';
import authRoutes from './auth.routes';
import walletRoutes from './wallet.routes';
import transactionRoutes from './transaction.routes';
import categoryRoutes from './category.routes';
import savingsRoutes from './savings.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// Auth routes are mounted at root since Better Auth needs /api/auth/*
router.use('/', authRoutes);

// Protected resource routes
router.use('/api/wallets', walletRoutes);
router.use('/api/transactions', transactionRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/api/savings', savingsRoutes);
router.use('/api/dashboard', dashboardRoutes);

export default router;
