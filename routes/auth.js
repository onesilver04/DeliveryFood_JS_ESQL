const express = require('express');
const { registerConsumer, registerOwner, loginConsumer, loginOwner } = require('../controllers/authController');
const router = express.Router();
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');
const editInfoController = require('../controllers/editInfoController');

router.get('/register-consumer', authController.registerConsumer);
router.post('/submit-consumer', authController.submitConsumer);

router.get('/register-owner', authController.registerOwner);
router.post('/submit-owner', authController.submitOwner);

// 손님 로그인 페이지
router.get('/login-consumer', authController.showConsumerLoginForm);
// 손님 로그인 처리
router.post('/login-consumer', authController.loginConsumer);
// 손님 대시보드
router.get('/consumer-dashboard', authController.consumerDashboard);
// 사장님 로그인 페이지
router.get('/login-owner', authController.showOwnerLoginForm);
// 사장님 로그인 처리
router.post('/login-owner', authController.loginOwner);
// 사장님 대시보드
router.get('/owner-dashboard', authController.ownerDashboard);
// 주문 내역 조회 라우트
router.get('/view-orders', viewController.viewConsumerOrders);
// 사장님 메뉴 조회 라우트
router.get('/view-owner-menu', viewController.viewOwnerMenu);
// 메뉴 추가 페이지
router.get('/add-menu', authController.showAddMenuForm);
// 메뉴 추가 처리
router.post('/add-menu', authController.addMenu);
// 메뉴 삭제
router.get('/delete-menu', editInfoController.deleteMenu);
// 메뉴 수정 페이지
router.get('/edit-menu', editInfoController.editMenu);
// 메뉴 수정 처리
router.post('/update-menu', editInfoController.updateMenu);
// 메뉴판 보기 처리
router.get('/place-order', viewController.showPlaceOrderForm);
router.post('/place-order', viewController.placeOrder);

// 정보 삭제 라우트
router.get('/delete-consumer', editInfoController.deleteConsumerInfo);
router.get('/delete-owner', editInfoController.deleteOwnerInfo);

module.exports = router;
