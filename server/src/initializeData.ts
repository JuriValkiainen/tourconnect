import { AppDataSource } from "./data-source";
import { Guides } from "./entities/Guides";
import { Tours } from "./entities/Tours";
import { Tourists } from "./entities/Tourists";

export const initializeDatabase = async () => {
    try {
    await AppDataSource.initialize();

    const guide = new Guides()
    guide.guideID = 1
    guide.firstName = "Mikko"
    guide.lastName = "Korhonen"
    guide.password= "test1"
    guide.description ="I am a good guide!"
    guide.email="Mikko@dks.dsd"
    guide.phone = "123456789"
    guide.photo = "https://cdn.pixabay.com/photo/2017/10/21/12/01/whiptail-wallaby-2874519_960_720.jpg"
    AppDataSource.manager.save(guide)

    const guide2 = new Guides()
    guide2.guideID = 2
    guide2.firstName = "Emilia"
    guide2.lastName = "Lehtinen"
    guide2.password= "test2"
    guide2.description ="I am a very good guide!"
    guide2.email="Emilia@dks.dsd"
    guide2.phone = "1111114"
    guide2.photo = "https://cdn.pixabay.com/photo/2025/03/09/16/02/hare-9457418_960_720.jpg"
    AppDataSource.manager.save(guide2)

    const guide3 = new Guides()
    guide3.guideID = 3
    guide3.firstName = "Juha"
    guide3.lastName = "Mäkinen"
    guide3.password= "test3"
    guide3.description ="I am guide!"
    guide3.email="eaj@dks.dsd"
    guide3.phone = "1333333"
    guide3.photo = "https://cdn.pixabay.com/photo/2025/03/05/14/35/cat-9448800_1280.jpg"
    AppDataSource.manager.save(guide3)

    const tour = new Tours()
     tour.tourID = 1
     tour.city = "Turku"
     tour.type = "Walking around the city center"
     tour.pricePerPerson = 20
     tour.maxPerson = 5
     tour.description = "Turku has a long history as Finland's largest city and occasionally as the administrative center of the country, but for the last two hundred years has been surpassed by Helsinki. The city's identity stems from its status as the oldest city in Finland and the country's first capital. Cultural venues in Turku include several museums, theatres, cinemas, art galleries, and music. Turku offers a variety of cultural events."
     tour.picture = "https://cdn.pixabay.com/photo/2018/10/24/20/08/church-3771148_1280.jpg"
     tour.guide = guide
     AppDataSource.manager.save(tour)

    const tour2 = new Tours()
    tour2.tourID = 2
    tour2.city = "Tampere"
    tour2.type = "Factory Tour"
    tour2.pricePerPerson= 25 
    tour2.maxPerson = 4
    tour2.description ="Tampere is the largest monolingual municipality in FinlandTampere is ranked 26th in the list of 446 hipster cities in the world and is often rated as the most popular city in Finland. One of the main tourist attractions is the Särkänniemi amusement park, which includes the landmark Näsinneula tower, topped by a revolving restaurant. In addition to these, it used to house an aquarium. Other sites of interest are Tampere Cathedral, Tampere City Hall, Tampere Central Library Metso, Kaleva Church (both designed by Reima Pietilä), the Tampere Hall (along Hämeenkatu) for conferences and concerts, the Tampere Market Hall and historical Pyynikki observation tower."
    tour2.picture = "https://cdn.pixabay.com/photo/2020/11/18/16/10/buildings-5755827_960_720.jpg"
    tour2.guide = guide2
    AppDataSource.manager.save(tour2)

    const tour3= new Tours()
    tour3.tourID = 3
    tour3.city = "Rovaniemi"
    tour3.type = "Northern nature"
    tour3.pricePerPerson = 50
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
    tourist1.phone = "2343213"
    AppDataSource.manager.save(tourist1)
}
catch(error) {
    console.log(error)
}
}