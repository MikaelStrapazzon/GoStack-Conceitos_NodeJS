const express = require( "express" );
const cors = require( "cors" );

const { v4: uuid, validate: isUuid } = require( "uuid" );

const app = express();

app.use( express.json() );
app.use( cors() );

function validateProjectExists( id )
{
	const projectIndex = repositories.findIndex( project => project.id == id );

	if( projectIndex < 0 )
	{
		return response.status( 400 ).json({ 'error': "Project not found." });
	}

	return projectIndex;
}

function validateProjectId( request, response, next )
{
	const { id } = request.params;

	if( !isUuid( id ) )
	{
		return response.status( 400 ).json({ 'error': "invalid project ID." });
	}

	return next();
}

app.use( "/repositories/:id", validateProjectId );



const repositories = [];

app.get( "/repositories", ( request, response ) => {
	return response.json( repositories );
});

app.post( "/repositories", ( request, response ) => {
	const { title, url, techs } = request.body;

	let project = {
		'id': uuid(),
		'title': title,
		'url': url,
		'techs': techs,
		'likes': 0
	};

	repositories.push( project );

	return response.json( project );
});

app.put( "/repositories/:id", ( request, response ) => {
	const { id } = request.params;
	const { title, url, techs } = request.body;

	const projectIndex = validateProjectExists( id );

	repositories[projectIndex]['title'] = title;
	repositories[projectIndex]['url'] = url;
	repositories[projectIndex]['techs'] = techs;

	return response.json( repositories[projectIndex] );
});

app.delete( "/repositories/:id", ( request, response ) => {
	const { id } = request.params;

	const projectIndex = validateProjectExists( id );

	repositories.splice( projectIndex, 1 );

	return response.status( 204 ).send();
});

app.post("/repositories/:id/like", (request, response) => {
	const { id } = request.params;

	const projectIndex = validateProjectExists( id );

	repositories[projectIndex]['likes']++;

	return response.json({ 'likes': repositories[projectIndex]['likes'] });
});

module.exports = app;