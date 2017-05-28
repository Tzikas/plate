const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const autoIncrement = require('mongoose-auto-increment')
const http = require('http')
const socketServer =require('socket.io')

const app = express();

const todoModel = require('./models/todoModel')  //todo model

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// MONGOOSE CONNECT
// ===========================================================================
mongoose.connect('mongodb://localhost:27017/todos')

var db = mongoose.connection
db.on('error', ()=> {console.log( '---Gethyl FAILED to connect to mongoose')})
db.once('open', () => {
	console.log( '+++Gethyl connected to mongoose')
})

var serve = http.createServer(app);
var io = socketServer(serve);
serve.listen(3000,()=> {console.log("+++Gethyl Express Server with Socket Running!!!")})


/***************************************************************************************** */
/* Socket logic starts here																   */
/***************************************************************************************** */
const connections = [];
io.on('connection', function (socket) {
	console.log("Connected to Socket!!"+ socket.id)	
	connections.push(socket)
	socket.on('disconnect', function(){
		console.log('Disconnected - '+ socket.id);
	});

	var cursor = todoModel.find({},"-_id itemId item completed",(err,result)=>{
				if (err){
					console.log("---Gethyl GET failed!!")
				}
				else {
					socket.emit('initialList',result)
					console.log("+++Gethyl GET worked!!")
				}
			})
	// 		.cursor()
	// cursor.on('data',(res)=> {socket.emit('initialList',res)})
	
	socket.on('addItem',(addData)=>{
		var todoItem = new todoModel({
			itemId:addData.id,
			item:addData.item,
			completed: addData.completed
		})

		todoItem.save((err,result)=> {
			if (err) {console.log("---Gethyl ADD NEW ITEM failed!! " + err)}
			else {
				// connections.forEach((currentConnection)=>{
				// 	currentConnection.emit('itemAdded',addData)
				// })
				io.emit('itemAdded',addData)
				
				console.log({message:"+++Gethyl ADD NEW ITEM worked!!"})
			}
		})
	})

	socket.on('markItem',(markedItem)=>{
		var condition   = {itemId:markedItem.id},
			updateValue = {completed:markedItem.completed}

		todoModel.update(condition,updateValue,(err,result)=>{
			if (err) {console.log("---Gethyl MARK COMPLETE failed!! " + err)}
			else {
				// connections.forEach((currentConnection)=>{
				// 	currentConnection.emit('itemMarked',markedItem)
				// })
				io.emit('itemMarked',markedItem)

				console.log({message:"+++Gethyl MARK COMPLETE worked!!"})
			}
		})
	})
	
});



const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('../config/config');
const webpackConfig = require('../webpack.config');

const isDev = process.env.NODE_ENV !== 'production';
// const {DATABASE_URL, PORT} = require('../config/config');
// console.log(DATABASE_URL);
// console.log(PORT);
const port  = process.env.PORT || 8080;


// Configuration
// ================================================================================================

// Set up Mongoose
mongoose.connect(config.db);
mongoose.Promise = global.Promise;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API routes
require('./routes')(app);

if (isDev) {
  const compiler = webpack(webpackConfig);

  app.use(historyApiFallback({
    verbose: false
  }));

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: path.resolve(__dirname, '../client/public'),
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  }));

  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.resolve(__dirname, '../dist')));
} else {
  app.use(express.static(path.resolve(__dirname, '../dist')));
  app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    res.end();
  });
}

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }

  console.info('>>> 🌎 Open http://0.0.0.0:%s/ in your browser.', port);
});

module.exports = app;
