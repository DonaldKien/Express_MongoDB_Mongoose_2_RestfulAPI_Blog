let express 		= require('express'),
	app 			= express(),
	mongoose 		= require('mongoose'),
	bodyParser 		= require('body-parser'),
	expressSanitizer= require('express-sanitizer'),
	methodOverride 	= require("method-override")

mongoose.connect("mongodb+srv://project_1:abc123!@cluster0.mibfu.mongodb.net/restfulblog?retryWrites=true&w=majority", {
	useNewUrlParser: true, useUnifiedTopology:true
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
	
let Blog = mongoose.model("Blog", new mongoose.Schema({
	title: String, 
	image: String, 
	body: String,
	created: {type: Date, default: Date.now()}
}));

app.get('/', (request, response) => {
	response.redirect('/blog')
})

// SHOW DATA IN DATABASE
app.get('/blog', (request, response) => {
	Blog.find({}, (err, data) => {
		if (err) {console.log(err)}
		else {response.render("index", {blogs:data})}
	})
})

// CREATE NEW DATA
app.post('/blog', (request, response) => {
	request.body.blog.body = request.sanitize(request.body.blog.body)
	Blog.create(request.body.blog, (err, newBlog) => {
		if (err) {response.render("new")}
		else {response.redirect("/blog")}
	})
	// let name1 = request.body.blog.title;
	// let image1 = request.body.blog.image;
	// let blogPost1 = request.body.blog.body;
	// let createBlog = {title:name1, image:image1, body:blogPost1}
	// Blog.create( createBlog, (err, newlyCreated) => {
	// 	if (err) {console.log(err)}
	// 	else {response.redirect('/blog')}
	// })
})

// SHOW FORM FOR CREATE
app.get('/blog/new', (request, response) => {
	response.render('new')
})

//SHOW ROUTE
app.get("/blog/:id", (request, response) => {
	Blog.findById(request.params.id, (err, showBlog) => {
		if (err) {
			response.redirect("/blog");
		} else {
			response.render("show", {blog:showBlog});
		}
	})
})

// EDIT ROUTE
app.get("/blog/:id/edit", (request, response) => {
	Blog.findById(request.params.id, (err, showBlog) => {
		if (err) {
			response.redirect("/blog/" + request.params.id)
		} else {
			response.render("edit", {blog: showBlog})
		}
	})
})

// UPDATE ROUTE
app.put("/blog/:id", (request, response) =>{
	request.body.blog.body = request.sanitize(request.body.blog.body)
	Blog.findByIdAndUpdate(request.params.id, request.body.blog, (err, editedBlog) => {
		if (err) {
			response.redirect("/blog")
		} else {
			response.redirect("/blog/" + request.params.id)
		}
	})
})

// DELETE 
app.delete("/blog/:id", (request, response) => {
	Blog.findByIdAndRemove( request.params.id, (err) => {
		if (err) {
			response.redirect("/blog")
		} else {
			response.redirect("/blog")
		}
	})
})

app.listen(process.env.PORT || 3010, () => {console.log("server connected")})




























