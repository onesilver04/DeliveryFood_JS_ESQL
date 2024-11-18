const express = require('express');
const editInfoController = require('../controllers/editInfoController');
const router = express.Router();

// 손님 정보 수정 페이지 및 업데이트 처리
router.get('/edit-consumer', editInfoController.editConsumerInfo);
router.post('/update-consumer', editInfoController.updateConsumerInfo);

// 사장님 정보 수정 페이지 및 업데이트 처리
router.get('/edit-owner', editInfoController.editOwnerInfo);
router.post('/update-owner', editInfoController.updateOwnerInfo);

module.exports = router;
