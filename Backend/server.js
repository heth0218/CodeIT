const express = require('express');
const connectDB = require('./config/db');
const course = require('./routes/Courses');
const quiz = require('./routes/quiz');
const videos = require('./routes/video');
const myCourse = require('./routes/MyCourse');
const Payment = require('./routes/Payment');
const auth = require('./routes/auth');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');

connectDB();

app.use(cors());
app.use(morgan('dev'));

app.use(express.json({ extended: false }));

app.use('/public', express.static('public'));
app.use('/api/users', require('./routes/user'));
app.use('/api/auth', auth);
app.use('/api/course', course);
app.use('/api/videos/', videos);
app.use('/api/mycourse', myCourse);
app.use('/api/quiz', quiz);
app.use('/api', Payment);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Hey! listening to you on port ${PORT}`);
});
