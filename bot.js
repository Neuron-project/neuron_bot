
const { initializeApp } = require('firebase/app')
const { getDatabase, ref, update, get } = require('firebase/database')
const { Telegraf } = require('telegraf')

require('dotenv').config()


const bot = new Telegraf(process.env.BOT_TOKEN_REGISTER)

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_API_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}


const firebase = initializeApp(firebaseConfig)
const database = getDatabase(firebase)

const registerUser = async newUserTelegramId => {
  const usersCollectionRef = ref(database, 'users')

  await update(usersCollectionRef, {
    [newUserTelegramId]: {
      points: 0,
      countDownTime: 0,
      startTimer: 0,
      isHadNft: false,
    },
  })
}

const bindReferralToUser = async (referrerTelegramId, referralTelegramId) => {
  const referrerRef = ref(database, `users/${referrerTelegramId}`)
  const referralsRef = ref(database, `users/${referrerTelegramId}/referrals`)
  const referrals =
    (await get(referralsRef)).val() !== null || undefined
      ? Object.values((await get(referralsRef)).val())
      : []

  referrals.push(referralTelegramId)

  await update(referrerRef, {
    referrals: referrals,
  })
}

const getUser = async telegramId => {
  const userRef = ref(database, `users/${telegramId}`)

  const user = (await get(userRef)).val()

  return user
}

bot.start(async ctx => {
  const currentTelegramUserId = ctx.from.id
  const user = await getUser(currentTelegramUserId)

  if (!user) {
    const messageText = ctx.message.text
    const match = messageText.match(/\/start\s+(\S+)/)
    const referrerId = match ? match[1] : null

    await registerUser(currentTelegramUserId)

    if (referrerId) {
      await bindReferralToUser(referrerId, currentTelegramUserId)
    }

    await ctx.reply('You have successfully registered!')
  } else {
    await ctx.reply('You have already registered!')
  }
})

bot.launch(() => {
  console.log('Бот запущен')
})
