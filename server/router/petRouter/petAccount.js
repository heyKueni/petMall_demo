const express = require('express')
const router = express.Router()
const tokenCheck = require('../../middleware/tokenCheck')
const { multerAdopt } = require('../../middleware/multerCheck')

const accountCtrl = require('../../controller/petCtrl/accountCtrl')

// 检查用户宠物信息
router.get('/checkPetExist', tokenCheck, accountCtrl.checkPetExist)
// 宠物信息 @添加
router.post('/addPet', tokenCheck, accountCtrl.addPet)
// 宠物信息 @删除
router.post('/delPet', tokenCheck, accountCtrl.delPet)
// 修改宠物信息 @查询
router.post('/petEditorSelect', tokenCheck, accountCtrl.petEditorSelect)
// 修改宠物信息 @修改
router.post('/changePet', tokenCheck, accountCtrl.changePet)
// 宠圈 @查询领养贴
router.get('/adoptSelectAll', accountCtrl.adoptSelectAll)
// 宠圈 @领养贴详情 -查询
router.get('/adoptIntroSelect', accountCtrl.adoptIntroSelect)
// 领养 @留言
router.post('/leaveWords', tokenCheck, accountCtrl.leaveWords)
// 参与领养 @查询列表
router.get('/selectMyLW', tokenCheck, accountCtrl.selectMyLW)
// 领养 @领养关系转接
router.post('/finishAdopt', tokenCheck, accountCtrl.finishAdopt)
// 领养 @发布领养贴
router.post(
  '/sendAdoptPost',
  tokenCheck,
  multerAdopt,
  accountCtrl.sendAdoptPost,
)
// 帖子 @发布帖子
router.post('/sendPost', tokenCheck, accountCtrl.sendPost)
// 宠圈 @查询帖子 -全部
router.get('/postSelectAll', accountCtrl.postSelectAll)
// 帖子 @查询详情
router.get('/selectPostIntro', accountCtrl.selectPostIntro)
// 帖子 @回复
router.post('/replyPost', tokenCheck, accountCtrl.replyPost)
// 查询帖子 @我的帖子
router.get('/postSelectOwner', tokenCheck, accountCtrl.postSelectOwner)
// 检测帖子收藏状态
router.get('/checkPostCollect', tokenCheck, accountCtrl.checkPostCollect)
// 修改帖子收藏
router.post('/changePostCollect', tokenCheck, accountCtrl.changePostCollect)
// 消息通知 @帖子回复
router.post('/selectMyReply', tokenCheck, accountCtrl.selectMyReply)

module.exports = router
