import { AppDataSource } from "./data-source";
import { Guides } from "./entities/Guides";
import { Tours } from "./entities/Tours";
import { Tourists } from "./entities/Tourists";
import { TourType } from "./entities/Tours"
import bcrypt from "bcryptjs";

export const initializeDatabase = async () => {
    try {
    await AppDataSource.initialize();

 const dataCounter = await AppDataSource.getRepository(Guides).count()
  if (dataCounter > 0 ) {
  return
  }

    const russianGuide = new Guides();
    russianGuide.firstName = "Иван";
    russianGuide.lastName = "Петров";
    russianGuide.password = await bcrypt.hash("russia2024", 10);
    russianGuide.description = "Профессиональный гид с 10-летним опытом. Провожу увлекательные экскурсии по главным городам России. Специализация: история, архитектура и местные традиции.";
    russianGuide.email = "ivan.petrov@tourconnect.ru";
    russianGuide.phone = "+79161234567";
    russianGuide.photo = "https://cdn.pixabay.com/photo/2018/01/17/07/06/laptop-3087585_1280.jpg"; // Фото гида (можно заменить)
    await AppDataSource.manager.save(russianGuide);

    const moscowTour = new Tours();
    moscowTour.city = "Moscow";
    moscowTour.type = TourType.Walk;
    moscowTour.pricePerPerson = 30;
    moscowTour.maxPerson = 10;
    moscowTour.description = "Explore the heart of Russia with a guided tour of Red Square, a UNESCO World Heritage Site. See the iconic St. Basil's Cathedral, Lenin's Mausoleum, and the Kremlin walls. Learn about Russia's tsarist and Soviet history while walking on centuries-old cobblestones.";
    moscowTour.picture = "https://cdn.pixabay.com/photo/2016/02/14/11/39/russia-1199330_1280.jpg";
    moscowTour.guide = russianGuide; // Предполагается, что `guide` уже определён
    await AppDataSource.manager.save(moscowTour);

    const petersburgTour = new Tours();
    petersburgTour.city = "Saint Petersburg";
    petersburgTour.type = TourType.Museum;
    petersburgTour.pricePerPerson = 40;
    petersburgTour.maxPerson = 8;
    petersburgTour.description = "Discover one of the world's largest art collections in the Winter Palace. The Hermitage houses masterpieces by Rembrandt, Da Vinci, and Michelangelo, along with golden treasures of Scythians. The tour includes the stunning interiors of the tsarist residence.";
    petersburgTour.picture = "https://cdn.pixabay.com/photo/2023/01/04/00/28/seagull-7695578_1280.jpg";
    petersburgTour.guide = russianGuide;
    await AppDataSource.manager.save(petersburgTour);

    const kazanTour = new Tours();
    kazanTour.city = "Kazan";
    kazanTour.type = TourType.History;
    kazanTour.pricePerPerson = 25;
    kazanTour.maxPerson = 6;
    kazanTour.description = "Kazan is where Europe meets Asia. The Kazan Kremlin, a UNESCO site, combines Russian Orthodox and Tatar Muslim architecture. Visit the Qolşärif Mosque, the Annunciation Cathedral, and the leaning Soyembika Tower. Taste traditional Tatar dishes like echpochmak after the tour.";
    kazanTour.picture = "https://cdn.pixabay.com/photo/2017/11/08/23/23/russia-2932006_960_720.jpg";
    kazanTour.guide = russianGuide;
    await AppDataSource.manager.save(kazanTour);

    const guide1 = new Guides()
    guide1.guideID = 1
    guide1.firstName = "Mikko"
    guide1.lastName = "Korhonen"
    guide1.password= await bcrypt.hash("test", 10);
    guide1.description ="I am a good guide!"
    guide1.email="Mikko@dks.dsd"
    guide1.phone = "123456789"
    guide1.photo = "https://cdn.pixabay.com/photo/2017/10/21/12/01/whiptail-wallaby-2874519_960_720.jpg"
    AppDataSource.manager.save(guide1)

    const guide2 = new Guides()
    guide2.guideID = 2
    guide2.firstName = "Emilia"
    guide2.lastName = "Lehtinen"
    guide2.password= await bcrypt.hash("test", 10);
    guide2.description ="I am a very good guide!"
    guide2.email="Emilia@dks.dsd"
    guide2.phone = "1111114"
    guide2.photo = "https://cdn.pixabay.com/photo/2025/03/09/16/02/hare-9457418_960_720.jpg"
    AppDataSource.manager.save(guide2)

    const guide3 = new Guides()
    guide3.guideID = 3
    guide3.firstName = "Juha"
    guide3.lastName = "Mäkinen"
    guide3.password= await bcrypt.hash("test", 10);
    guide3.description ="I am guide!"
    guide3.email="eaj@dks.dsd"
    guide3.phone = "1333333"
    guide3.photo = "https://cdn.pixabay.com/photo/2025/03/05/14/35/cat-9448800_1280.jpg"
    AppDataSource.manager.save(guide3)

    const tour1 = new Tours()
    tour1.tourID = 1
    tour1.city = "Turku"
    tour1.type = TourType.Kids
    tour1.pricePerPerson = 20
    tour1.maxPerson = 5
    tour1.description = "Turku has a long history as Finland's largest city and occasionally as the administrative center of the country, but for the last two hundred years has been surpassed by Helsinki. The city's identity stems from its status as the oldest city in Finland and the country's first capital. Cultural venues in Turku include several museums, theatres, cinemas, art galleries, and music. Turku offers a variety of cultural events."
    tour1.picture = "https://cdn.pixabay.com/photo/2018/10/24/20/08/church-3771148_1280.jpg"
    tour1.guide = guide1
    AppDataSource.manager.save(tour1)

    const tour2 = new Tours()
    tour2.tourID = 2
    tour2.city = "Tampere"
    tour2.type = TourType.Food
    tour2.pricePerPerson= 25 
    tour2.maxPerson = 4
    tour2.description ="Tampere is the largest monolingual municipality in FinlandTampere is ranked 26th in the list of 446 hipster cities in the world and is often rated as the most popular city in Finland. One of the main tourist attractions is the Särkänniemi amusement park, which includes the landmark Näsinneula tower, topped by a revolving restaurant. In addition to these, it used to house an aquarium. Other sites of interest are Tampere Cathedral, Tampere City Hall, Tampere Central Library Metso, Kaleva Church (both designed by Reima Pietilä), the Tampere Hall (along Hämeenkatu) for conferences and concerts, the Tampere Market Hall and historical Pyynikki observation tower."
    tour2.picture = "https://cdn.pixabay.com/photo/2020/11/18/16/10/buildings-5755827_960_720.jpg"
    tour2.guide = guide2
    AppDataSource.manager.save(tour2)

    const tour3= new Tours()
    tour3.tourID = 3
    tour3.city = "Rovaniemi"
    tour3.type = TourType.Outdoor
    tour3.pricePerPerson = 50
    tour3.maxPerson = 3
    tour3.description ="Rovaniemi's most prominent landmarks include the Jätkänkynttilä bridge with its eternal flame over the Kemijoki river, the Arktikum Science Museum, which rises out of the bank of the Ounasjoki river, the Rovaniemi city hall, the Lappia Hall, which serves as a theatre, concert hall, and congress centre, and the library.The last three mentioned buildings are designed by Alvar Aalto. The Arktikum Science Museum is a comprehensive museum of Finland's, and the world's, Arctic regions."
    tour3.picture = "https://cdn.pixabay.com/photo/2020/05/26/09/35/rovaniemi-5222404_1280.jpg"
    tour3.guide =guide3
    AppDataSource.manager.save(tour3)

    const tourist1 = new Tourists()
    tourist1.touristID = 2
    tourist1.firstName = "Pekka"
    tourist1.lastName = "Elo"
    tourist1.email="Elo@dks.dsd"
    tourist1.password = await bcrypt.hash("test", 10);
    tourist1.phone = "2343213"
    AppDataSource.manager.save(tourist1)

    const deleted = new Tourists()
    deleted.touristID = 1
    deleted.firstName = "Deleted"
    deleted.lastName = "Account"
    deleted.email="deleted"
    deleted.password = await bcrypt.hash("deleted", 10);
    deleted.phone = "777"
    AppDataSource.manager.save(deleted)

    const tour4 = new Tours()
     tour4.tourID = 4
     tour4.city = "New York"
     tour4.type = TourType.Walk
     tour4.pricePerPerson = 20
     tour4.maxPerson = 5
     tour4.description = "New York, often called New York City (NYC), is the most populous city in the United States, located at the southern tip of New York State on one of the world's largest natural harbors. The city comprises five boroughs, each coextensive with a respective county. The city is the geographical and demographic center of both the Northeast megalopolis and the New York metropolitan area, the largest metropolitan area in the United States by both population and urban area. New York is a global center of finance and commerce, culture, technology, entertainment and media, academics and scientific output, the arts and fashion, and, as home to the headquarters of the United Nations, international diplomacy."
     tour4.picture = "https://www.w3schools.com/w3images/newyork2.jpg"
     tour4.guide = guide1
     AppDataSource.manager.save(tour4)

    const tour5 = new Tours()
    tour5.tourID = 5
    tour5.city = "Cinque Terre"
    tour5.type = TourType.Outdoor
    tour5.pricePerPerson= 25 
    tour5.maxPerson = 4
    tour5.description ="The Cinque Terre are a coastal area within Liguria, in the northwest of Italy. It lies in the west of La Spezia Province, and comprises five villages: Monterosso al Mare, Vernazza, Corniglia, Manarola, and Riomaggiore. The coastline, the five villages, and the surrounding hillsides are all part of the Cinque Terre National Park, a UNESCO World Heritage Site. The Cinque Terre area is a popular tourist destination. Over the centuries, people have built terraces on the rugged, steep landscape right up to the cliffs that overlook the Ligurian Sea. Paths, trains, and boats connect the villages as cars can only reach them with great difficulty from the outside via narrow and precarious mountain roads."
    tour5.picture = "https://www.w3schools.com/w3images/cinqueterre.jpg"
    tour5.guide = guide2
    AppDataSource.manager.save(tour5)

    const tour6= new Tours()
    tour6.tourID = 6
    tour6.city = "San Francisco"
    tour6.type = TourType.Food
    tour6.pricePerPerson = 50
    tour6.maxPerson = 3
    tour6.description ="San Francisco, officially the City and County of San Francisco, is a commercial, financial, and cultural center within Northern California, United States. With a population of 827,526 residents as of 2024,  San Francisco is the fourth-most populous city in California and the 17th-most populous in the U.S.; with a land area of 46.9 square miles (121 square kilometers) at the upper end of the San Francisco Peninsula, it is the fifth-most densely populated U.S. county. Among U.S. cities proper with over 250,000 residents, San Francisco is ranked first by per capita income and sixth by aggregate income as of 2023. San Francisco anchors the 13th-most populous metropolitan statistical area in the U.S., with almost 4.6 million residents in 2023. The larger San Jose–San Francisco–Oakland combined statistical area, the fifth-largest urban region in the U.S., had a 2023 estimated population of over nine million."
    tour6.picture = "https://www.w3schools.com/w3images/sanfran.jpg"
    tour6.guide =guide3
    AppDataSource.manager.save(tour6)

    const tour7 = new Tours()
     tour7.tourID = 7
     tour7.city = "Pisa"
     tour7.type = TourType.Museum
     tour7.pricePerPerson = 20
     tour7.maxPerson = 5
     tour7.description = "Most believe the hypothesis that the origin of the name Pisa comes from Etruscan and means 'mouth', as Pisa is at the mouth of the Arno river. Although throughout history there have been several uncertainties about the origin of the city of Pisa, excavations made in the 1980s and 1990s found numerous archaeological remains, including the fifth century BC tomb of an Etruscan prince, proving the Etruscan origin of the city, and its role as a maritime city, showing that it also maintained trade relations with other Mediterranean civilizations. Ancient Roman authors referred to Pisa as an old city. Virgil, in his Aeneid, states that Pisa was already a great center by the times described; and gives the epithet of Alphēae to the city because it was said to have been founded by colonists from Pisa in Elis, near which the Alpheius river flowed. The Virgilian commentator Servius wrote that the Teuti founded the town 13 centuries before the start of the common era."
     tour7.picture = "https://www.w3schools.com/w3images/pisa.jpg"
     tour7.guide = guide1
     AppDataSource.manager.save(tour7)

    const tour8 = new Tours()
    tour8.tourID = 8
    tour8.city = "Paris"
    tour8.type = TourType.Museum
    tour8.pricePerPerson= 25 
    tour8.maxPerson = 4
    tour8.description ="Paris is a major railway, highway, and air-transport hub served by two international airports: Charles de Gaulle Airport, the third-busiest airport in Europe, and Orly Airport. Paris has one of the most sustainable transportation systems and is one of only two cities in the world that received the Sustainable Transport Award twice.[13] Paris is known for its museums and architectural landmarks: the Louvre received 8.9 million visitors in 2023, on track for keeping its position as the most-visited art museum in the world. The Musée d'Orsay, Musée Marmottan Monet and Musée de l'Orangerie are noted for their collections of French Impressionist art. The Pompidou Centre, Musée National d'Art Moderne, Musée Rodin and Musée Picasso are noted for their collections of modern and contemporary art. The historical district along the Seine in the city centre has been classified as a UNESCO World Heritage Site since 1991."
    tour8.picture = "https://www.w3schools.com/w3images/paris.jpg"
    tour8.guide = guide2
    AppDataSource.manager.save(tour8)

    }  
catch(error) {
    console.log(error)
}
}