import express , {Express, Request, Response}from 'express'


const app:Express = express();


app.get('/', (_: Request,res: Response)=>{
    res.send('Working')
})

app.listen(3000, ()=>{
    console.log(`Server is running on the http://localhost:3000`)
})
