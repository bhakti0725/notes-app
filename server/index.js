const express= require('express');
const cors= require('cors');
const dotenv= require('dotenv');
const connectDB= require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const  app=express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/notes', require('./routes/notes.routes'));

app.get('/health', (req, res)=>{
    res.json({status: 'server is running'});
});

app.use((req,res)=>{
    res.status(404).json({msg: 'Route not found'});
});

app.use(errorHandler);

const PORT= process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
