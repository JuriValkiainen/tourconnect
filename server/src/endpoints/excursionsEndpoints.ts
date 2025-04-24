import { AppDataSource } from "../data-source";
import { Tours, TourType } from "../entities/Tours";
import { Guides } from "../entities/Guides";
import { Reservations } from "../entities/Reservations"
import { Router, Request, Response } from 'express';
import { verifyGuideToken } from '../server'
import { verifyTouristToken } from '../server'
import { FindOptionsWhere } from 'typeorm'
const router = Router();

// Список всех экскурсий
router.get("/excursions", async (req, res) => {
    const { city, date } = req.query; 
    const filters: any = {};
    if (city) filters.city = city;  
    //if (date) filters.type = date;  // Date filtering is not used at the moment  
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

// Список доступных типов экскурсий
router.get("/tourtypes", async (req: Request, res: Response) => {
  const tourtypes = Object.values(TourType);
  res.json(tourtypes); 
});

// Экскурсия по id экскурсии
router.get("/excursions/:id",  async (req: Request<{ id: number }>, res: any) => { 
    const { id } = req.params;
    try {
      const tour = await AppDataSource.manager.findOne(Tours, {
        where: { tourID: id },
        relations: [
          'guide'
        ]
      });
      
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }

      const tourinfo = {city: tour.city, 
        tourID: tour.tourID,
        type: tour.type,
        pricePerPerson: tour.pricePerPerson,
        maxPerson: tour.maxPerson,
        description: tour.description,
        picture: tour.picture,
        guide:{
          lastName: tour.guide.lastName, 
          firstName: tour.guide.firstName
        }
      }
      res.json(tourinfo);
    } catch (error) {
      console.error("Error fetching tour:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  //  5 рандомных экскурсий не о природе
  router.get("/randomtours", async(req: Request, res: any) => {
    try {
      const tour = await AppDataSource.getRepository(Tours).createQueryBuilder("tours")
      .where("tours.type != :outdoorType", { outdoorType: "Outdoor" })
      .addOrderBy("NEWID()").limit(5).getMany()

      if (!tour|| tour.length === 0) {
        return res.status(404).json({ error: "Tour not found" });
      }

      const tourreturn = tour.map(t => ({
        tourID: t.tourID,
        city: t.city,
        picture: t.picture, 
        }))
  
      res.json(tourreturn);
         
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching excursions." });
    }
});

router.get("/tourtypes", async (req: Request, res: Response) => {
  const tourtypes = Object.values(TourType);
  res.json(tourtypes); 
});
//  2 рандомных экскурсий Outdoor
router.get("/outdoortours", async(req: Request, res: any) => {
  try {
    const outdoortour = await AppDataSource.getRepository(Tours).createQueryBuilder("tours")
    .where("tours.type = :outdoorType", { outdoorType: "Outdoor" })
    .addOrderBy("NEWID()").limit(2).getMany()

    if (!outdoortour|| outdoortour.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }

    const tourreturn = outdoortour.map(t => ({
      tourID: t.tourID,
      city: t.city,
      picture: t.picture, 
      }))

    res.json(tourreturn);
       
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching excursions." });
  }
});

// Cоздание экскурсии 
interface CreateToursRequest
{
    city: string
    type: TourType
    maxPerson: number
    pricePerPerson: number
    description: string
    picture: string
    guideID: number
    }
router.post("/api/tours", verifyGuideToken, async (req: Request, res: any) => {
    try {

      const { id: guideID } = req.user as { id: number; email: string; role: string }
            
      if (!guideID) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
        const reqData = req.body as CreateToursRequest
        
        if (!reqData.city || !reqData.type || !reqData.maxPerson|| !reqData.pricePerPerson|| !reqData.description|| !reqData.picture) {
            return res.status(400).json({ error: "All fields are required" });
          }

          const guide = await AppDataSource.getRepository(Guides).findOne({ where: { guideID } });
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    const newTours = await AppDataSource.getRepository(Tours).create()
    newTours.city = reqData.city
    newTours.type = reqData.type
    newTours. maxPerson = reqData.maxPerson
    newTours.pricePerPerson = reqData.pricePerPerson
    newTours.description = reqData.description
    newTours.picture = reqData.picture
    newTours.guide = guide

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

//Редактирование экскурсий 
type UpdateToursRequest = Omit<CreateToursRequest, "guideID">
  
router.put("/api/tours/:tourID", verifyGuideToken, async (req: Request, res: any) => {
  try {
    const { id: guideID } = req.user as { id: number; email: string; role: string }
          
    if (!guideID) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const tourID = parseInt(req.params.tourID);

  if (isNaN(tourID)) {
    return res.status(400).json({ error: "Invalid tour ID" });
  }
    const reqData = req.body as UpdateToursRequest  

    if (!reqData.city || !reqData.type || !reqData.maxPerson|| !reqData.pricePerPerson|| !reqData.description|| !reqData.picture) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const tourRepo = AppDataSource.getRepository(Tours);
    const tour = await tourRepo.findOne({ where: { tourID: tourID,  guide: { guideID: guideID }} as FindOptionsWhere<Tours> 
     });

    if (!tour) {
      return res.status(403).json({ error: "Tour not found or you do not have permission to edit it" });
    }

    tour.city = reqData.city
    tour.type = reqData.type
    tour. maxPerson = reqData.maxPerson
    tour.pricePerPerson = reqData.pricePerPerson
    tour.description = reqData.description
    tour.picture = reqData.picture

    await tourRepo.save(tour)
    return res.status(200).json({ success: true })
  
}
    catch (error) {
        console.error("Registration error:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})  
  
// Удаление экскурсии 
router.delete("/api/tours/:tourID", verifyGuideToken, async (req: Request, res: any) => {
  try {
    const { id: guideID } = req.user as { id: number; email: string; role: string };
          
    if (!guideID) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const tourID = parseInt(req.params.tourID);
    if (isNaN(tourID)) {
      return res.status(400).json({ error: "Invalid tour ID" });
    }

    const tourRepo = AppDataSource.getRepository(Tours);

    const tour = await tourRepo.findOne({
      where: { tourID: tourID, guide: { guideID: guideID } },
    });

    if (!tour) {
      return res.status(403).json({ error: "Tour not found or you do not have permission to delete it" });
    }

    await tourRepo.remove(tour);

    return res.status(200).json({ success: true});
  
  } catch (error) {
    console.error("Error while deleting the tour:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Бронирование экскурсий Туристом
interface CreateReservationRequest
{
    tourID: number
    touristID: number
    date: string
    numberOfPeople: number
    summa: number
}
router.post("/bookings", verifyTouristToken, async (req: Request, res: any) => {
    
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

export default router;