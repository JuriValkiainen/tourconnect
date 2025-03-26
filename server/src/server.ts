import { Tourists } from "./entity/Tourists";
import { AppDataSource } from "./data-source";
//import express, { Express, Request, Response , Application } from 'express';
import { Tours } from "./entity/Tours";
import { Guides } from "./entity/Guides";

import cors from "cors";
import { Reservations } from "./entity/Reservations";

import express, { Request, Response } from 'express';

//import dotenv from "dotenv";

//dotenv.config();

AppDataSource.initialize().then(() => {
     
    const guide = new Guides()
    guide.guideID = 1
    guide.firstName = "Mikko"
    guide.lastName = "Korhonen"
    guide.password= "test1"
    guide.description ="I am a good guide!"
    guide.email="Mikko@dks.dsd"
    guide.phone = 123456789
    guide.photo = "https://cdn.pixabay.com/photo/2017/10/21/12/01/whiptail-wallaby-2874519_960_720.jpg"
    AppDataSource.manager.save(guide)

    const guide2 = new Guides()
    guide2.guideID = 2
    guide2.firstName = "Emilia"
    guide2.lastName = "Lehtinen"
    guide2.password= "test2"
    guide2.description ="I am a very good guide!"
    guide2.email="Emilia@dks.dsd"
    guide2.phone = 1111114
    guide2.photo = "https://cdn.pixabay.com/photo/2025/03/09/16/02/hare-9457418_960_720.jpg"
    AppDataSource.manager.save(guide2)

    const guide3 = new Guides()
    guide3.guideID = 3
    guide3.firstName = "Juha"
    guide3.lastName = "Mäkinen"
    guide3.password= "test3"
    guide3.description ="I am guide!"
    guide3.email="eaj@dks.dsd"
    guide3.phone = 1333333
    guide3.photo = "https://cdn.pixabay.com/photo/2025/03/05/14/35/cat-9448800_1280.jpg"
    AppDataSource.manager.save(guide3)

    const tour = new Tours()
     tour.tourID = 1
     tour.city = "Turku"
     tour.type = "Walking around the city center"
     tour.prisePerPerson = 20
     tour.maxPerson = 5
     tour.description = "Turku has a long history as Finland's largest city and occasionally as the administrative center of the country, but for the last two hundred years has been surpassed by Helsinki. The city's identity stems from its status as the oldest city in Finland and the country's first capital. Cultural venues in Turku include several museums, theatres, cinemas, art galleries, and music. Turku offers a variety of cultural events."
     tour.picture = "https://cdn.pixabay.com/photo/2018/10/24/20/08/church-3771148_1280.jpg"
     tour.guide = guide
     AppDataSource.manager.save(tour)

    const tour2 = new Tours()
    tour2.tourID = 2
    tour2.city = "Tampere"
    tour2.type = "Factory Tour"
    tour2.prisePerPerson= 25 
    tour2.maxPerson = 4
    tour2.description ="Tampere is the largest monolingual municipality in FinlandTampere is ranked 26th in the list of 446 hipster cities in the world and is often rated as the most popular city in Finland. One of the main tourist attractions is the Särkänniemi amusement park, which includes the landmark Näsinneula tower, topped by a revolving restaurant. In addition to these, it used to house an aquarium. Other sites of interest are Tampere Cathedral, Tampere City Hall, Tampere Central Library Metso, Kaleva Church (both designed by Reima Pietilä), the Tampere Hall (along Hämeenkatu) for conferences and concerts, the Tampere Market Hall and historical Pyynikki observation tower."
    tour2.picture = "https://cdn.pixabay.com/photo/2020/11/18/16/10/buildings-5755827_960_720.jpg"
    tour2.guide = guide2
    AppDataSource.manager.save(tour2)

    const tour3= new Tours()
    tour3.tourID = 3
    tour3.city = "Rovaniemi"
    tour3.type = "Northern nature"
    tour3.prisePerPerson = 50
    tour3.maxPerson = 3
    tour3.description ="Rovaniemi's most prominent landmarks include the Jätkänkynttilä bridge with its eternal flame over the Kemijoki river, the Arktikum Science Museum, which rises out of the bank of the Ounasjoki river, the Rovaniemi city hall, the Lappia Hall, which serves as a theatre, concert hall, and congress centre, and the library.The last three mentioned buildings are designed by Alvar Aalto. The Arktikum Science Museum is a comprehensive museum of Finland's, and the world's, Arctic regions."
    tour3.picture = "https://cdn.pixabay.com/photo/2020/05/26/09/35/rovaniemi-5222404_1280.jpg"
    tour3.guide =guide3
    AppDataSource.manager.save(tour3)

    const tourist1 = new Tourists()
    tourist1.touristID = 1
    tourist1.firstName = "Pekka"
    tourist1.lastName = "Elo"
    tourist1.email="Elo@dks.dsd"
    tourist1.password = "password"
    tourist1.phone = 2343213
    AppDataSource.manager.save(tourist1)
  
}).catch((error: any) => console.log(error))

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
    res.send("TourConnect API is running...");
});


//-------------------GET--------------------------
app.get("/cities", async (req, res) => {
    const cities = await AppDataSource.manager.find(Tours, {select: { city: true }} );
    const cityList = cities.map(c => c.city);
    console.log(JSON.stringify(cities, null, 2))
    res.json(cityList)
});

app.get("/excursions", async (req, res) => {
    const { city, type } = req.query; 
    const filters: any = {};
    if (city) filters.city = city;  
    if (type) filters.type = type;  
    try {
            const tours = await AppDataSource.manager.find(Tours, {
            where: filters
        });
        res.json(tours);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching excursions." });
    }
});


app.get("/excursions/:id",  async (req: Request<{ id: number }>, res: any) => {
    
    const { id } = req.params;
  
    try {
      const tour = await AppDataSource.manager.findOne(Tours, {
        where: { tourID: id }
      });
  
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }
  
      res.json(tour);
    } catch (error) {
      console.error("Error fetching tour:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });



//-------------------POST--------------------------

interface CreateReservationRequest
{
    tourID: number
    touristID: number
    date: string
    numberOfPeople: number
    summa: number
}

app.post("/booking", async (req: Request, res: any) => {
    try {
        const reqData = req.body as CreateReservationRequest
        
        if (!reqData.tourID || !reqData.touristID || !reqData.date || !reqData.numberOfPeople|| !reqData.summa) {
            return res.status(400).json({ error: "All fields are required" });
          }
          const parsedDate = new Date(reqData.date);
          if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
          }
      
          if (reqData.numberOfPeople <= 0) {
            return res.status(400).json({ error: "Number of people must be greater than zero" });
          }

    const newReservation = await AppDataSource.getRepository(Reservations).create()
    newReservation.touristID = reqData.touristID
    newReservation.tourID = reqData.tourID
    newReservation.date = parsedDate
    newReservation.numberOfPeople = reqData.numberOfPeople
    newReservation.summa = reqData.summa


    const result = await AppDataSource.getRepository(Reservations).save(newReservation)
    res.json({
        id : result.reservID
    })
    }
    catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ error: "Internal server error" });
    }

})

interface CreateRegisterRequest
{
    firstName: string
    lastName: string
    password: string
    phone: number
    email: string
    }

app.post("/register", async (req: Request, res: any) => {
    try {
        const reqData = req.body as CreateRegisterRequest
        
        if (!reqData.firstName || !reqData.lastName || !reqData.password|| !reqData.phone|| !reqData.email) {
            return res.status(400).json({ error: "All fields are required" });
          }
        

    const newTourists = await AppDataSource.getRepository(Tourists).create()
    newTourists.firstName = reqData.firstName
    newTourists.lastName = reqData.lastName
    newTourists.password = reqData.password
    newTourists.phone = reqData.phone
    newTourists.email = reqData.email


    const result = await AppDataSource.getRepository(Tourists).save(newTourists)
    res.json({
        id : result.touristID
    })
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

interface CreateGuideRegisterRequest
{
    firstName: string
    lastName: string
    password: string
    phone: number
    description: string
    photo: string
    email: string
    }

app.post("/guides/register", async (req: Request, res: any) => {
    try {
        const reqData = req.body as CreateGuideRegisterRequest
        
        if (!reqData.firstName || !reqData.lastName || !reqData.password|| !reqData.phone|| !reqData.description|| !reqData.email) {
            return res.status(400).json({ error: "All fields are required" });
          }
        
    const newGuides = await AppDataSource.getRepository(Guides).create()
    newGuides.firstName = reqData.firstName
    newGuides.lastName = reqData.lastName
    newGuides.password = reqData.password
    newGuides.phone = reqData.phone
    newGuides.description = reqData.description
    newGuides.photo = reqData.photo
    newGuides.email = reqData.email

    const result = await AppDataSource.getRepository(Guides).save(newGuides)
    res.json({
        id : result.guideID
    })
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }


})

interface CreateToursRequest
{
    city: string
    type: string
    maxPerson: number
    prisePerPerson: number
    description: string
    picture: string
    }

app.post("/excursions", async (req: Request, res: any) => {
    try {
        const reqData = req.body as CreateToursRequest
        
        if (!reqData.city || !reqData.type || !reqData.maxPerson|| !reqData.prisePerPerson|| !reqData.description|| !reqData.picture) {
            return res.status(400).json({ error: "All fields are required" });
          }
        

    const newTours = await AppDataSource.getRepository(Tours).create()
    newTours.city = reqData.city
    newTours.type = reqData.type
    newTours. maxPerson = reqData.maxPerson
    newTours.prisePerPerson = reqData.prisePerPerson
    newTours.description = reqData.description
    newTours.picture = reqData.picture

    const result = await AppDataSource.getRepository(Tours).save(newTours)
    res.json({
        id : result.tourID
    })
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }

})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});