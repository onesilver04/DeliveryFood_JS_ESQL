const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

// 손님 정보 조회 경로
router.get('/view-consumer', viewController.viewConsumerInfo);

// 사장님 정보 조회 경로
router.get('/view-owner', viewController.viewOwnerInfo);

module.exports = router;
