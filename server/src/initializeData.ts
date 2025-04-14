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

    const tour4 = new Tours()
     tour.tourID = 4
     tour.city = "New York"
     tour.type = "Walking around the city center"
     tour.pricePerPerson = 20
     tour.maxPerson = 5
     tour.description = "New York, often called New York City (NYC), is the most populous city in the United States, located at the southern tip of New York State on one of the world's largest natural harbors. The city comprises five boroughs, each coextensive with a respective county. The city is the geographical and demographic center of both the Northeast megalopolis and the New York metropolitan area, the largest metropolitan area in the United States by both population and urban area. New York is a global center of finance and commerce, culture, technology, entertainment and media, academics and scientific output, the arts and fashion, and, as home to the headquarters of the United Nations, international diplomacy."
     tour.picture = "https://www.w3schools.com/w3images/newyork2.jpg"
     tour.guide = guide
     AppDataSource.manager.save(tour)

    const tour5 = new Tours()
    tour2.tourID = 5
    tour2.city = "Cinque Terre"
    tour2.type = "Factory Tour"
    tour2.pricePerPerson= 25 
    tour2.maxPerson = 4
    tour2.description ="The Cinque Terre are a coastal area within Liguria, in the northwest of Italy. It lies in the west of La Spezia Province, and comprises five villages: Monterosso al Mare, Vernazza, Corniglia, Manarola, and Riomaggiore. The coastline, the five villages, and the surrounding hillsides are all part of the Cinque Terre National Park, a UNESCO World Heritage Site. The Cinque Terre area is a popular tourist destination. Over the centuries, people have built terraces on the rugged, steep landscape right up to the cliffs that overlook the Ligurian Sea. Paths, trains, and boats connect the villages as cars can only reach them with great difficulty from the outside via narrow and precarious mountain roads."
    tour2.picture = "https://www.w3schools.com/w3images/cinqueterre.jpg"
    tour2.guide = guide2
    AppDataSource.manager.save(tour2)

    const tour6= new Tours()
    tour3.tourID = 6
    tour3.city = "San Francisco"
    tour3.type = "Walking around the city center"
    tour3.pricePerPerson = 50
    tour3.maxPerson = 3
    tour3.description ="San Francisco, officially the City and County of San Francisco, is a commercial, financial, and cultural center within Northern California, United States. With a population of 827,526 residents as of 2024,  San Francisco is the fourth-most populous city in California and the 17th-most populous in the U.S.; with a land area of 46.9 square miles (121 square kilometers) at the upper end of the San Francisco Peninsula, it is the fifth-most densely populated U.S. county. Among U.S. cities proper with over 250,000 residents, San Francisco is ranked first by per capita income and sixth by aggregate income as of 2023. San Francisco anchors the 13th-most populous metropolitan statistical area in the U.S., with almost 4.6 million residents in 2023. The larger San Jose–San Francisco–Oakland combined statistical area, the fifth-largest urban region in the U.S., had a 2023 estimated population of over nine million."
    tour3.picture = "https://www.w3schools.com/w3images/sanfran.jpg"
    tour3.guide =guide3
    AppDataSource.manager.save(tour3)

    const tour7 = new Tours()
     tour.tourID = 7
     tour.city = "Pisa"
     tour.type = "Walking around the city center"
     tour.pricePerPerson = 20
     tour.maxPerson = 5
     tour.description = "Most believe the hypothesis that the origin of the name Pisa comes from Etruscan and means 'mouth', as Pisa is at the mouth of the Arno river. Although throughout history there have been several uncertainties about the origin of the city of Pisa, excavations made in the 1980s and 1990s found numerous archaeological remains, including the fifth century BC tomb of an Etruscan prince, proving the Etruscan origin of the city, and its role as a maritime city, showing that it also maintained trade relations with other Mediterranean civilizations. Ancient Roman authors referred to Pisa as an old city. Virgil, in his Aeneid, states that Pisa was already a great center by the times described; and gives the epithet of Alphēae to the city because it was said to have been founded by colonists from Pisa in Elis, near which the Alpheius river flowed. The Virgilian commentator Servius wrote that the Teuti founded the town 13 centuries before the start of the common era."
     tour.picture = "https://www.w3schools.com/w3images/pisa.jpg"
     tour.guide = guide
     AppDataSource.manager.save(tour)

    const tour8 = new Tours()
    tour2.tourID = 8
    tour2.city = "Paris"
    tour2.type = "Factory Tour"
    tour2.pricePerPerson= 25 
    tour2.maxPerson = 4
    tour2.description ="Paris is a major railway, highway, and air-transport hub served by two international airports: Charles de Gaulle Airport, the third-busiest airport in Europe, and Orly Airport. Paris has one of the most sustainable transportation systems and is one of only two cities in the world that received the Sustainable Transport Award twice.[13] Paris is known for its museums and architectural landmarks: the Louvre received 8.9 million visitors in 2023, on track for keeping its position as the most-visited art museum in the world. The Musée d'Orsay, Musée Marmottan Monet and Musée de l'Orangerie are noted for their collections of French Impressionist art. The Pompidou Centre, Musée National d'Art Moderne, Musée Rodin and Musée Picasso are noted for their collections of modern and contemporary art. The historical district along the Seine in the city centre has been classified as a UNESCO World Heritage Site since 1991."
    tour2.picture = "https://www.w3schools.com/w3images/paris.jpg"
    tour2.guide = guide2
    AppDataSource.manager.save(tour2)

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