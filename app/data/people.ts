export type Member = {
    name: string
    role?: string
    affiliation?: string
    bio?: string
    image?: string
}

export type Section = {
    title: string
    type: 'grid' | 'list'
    members: Member[]
}

export const peopleData: Section[] = [
    {
        title: "Faculty",
        type: "grid",
        members: [
            { name: "Dr. Tomaso A. Poggio", affiliation: "Massachusetts Institute of Technology", image: "/people/poggio-240x300.jpg" },
            { name: "Emma Downs", role: "Administrative Assistant to Dr. Tomaso Poggio", affiliation: "Massachusetts Institute of Technology", image: "/people/emma-downs.jpg" },
        ]
    },
    {
        title: "Postdoctoral Associates",
        type: "grid",
        members: [
            { name: "Qianli Liao", affiliation: "Massachusetts Institute of Technology", image: "/people/Qianli-picture.png" },
            { name: "Pierfrancesco Beneventano", affiliation: "Massachusetts Institute of Technology", image: "/people/pier-285x300.jpg" },
            { name: "Daniel Mitropolsky", image: "/people/mitropol-300x300.jpg" },
        ]
    },
    {
        title: "Graduate Students",
        type: "grid",
        members: [
            { name: "Marc Gong Bacvanski", image: "/people/marc-300x300.jpeg" },
            { name: "Yulu Gan", image: "/people/yulu.jpeg" },
            { name: "David Koplow", image: "/people/david.jpeg" },

        ]
    },
    {
        title: "Visiting Faculty",
        type: "grid",
        members: [
            { name: "Lorenzo Rosasco", affiliation: "Universita’ di Genova", image: "/people/rosasco-picture.jpg" },
        ]
    },
    {
        title: "Visiting Students, Scholars and Scientists",
        type: "grid",
        members: [
            { name: "Liu Ziyin", image: "/people/ziyinl_pic-300x300.png" },
            { name: "John Gabrieli Buchet", affiliation: "Johns Hopkins University", image: "/people/John.jpg" },
        ]
    },

    {
        title: "Former Postdoctoral Associates & PhD Students",
        type: "list",
        members: [
            { name: "Xavier Boix" },
            { name: "Mengjia Xu" },
            { name: "Akshay Rangamani" },
            { name: "Tomer Galanti" },
            { name: "Arturo Deza" },
            { name: "Xu (Roland) Zihao" },
            { name: "Tomotake Sasaki" },
            { name: "Andrzej Banburski" },
            { name: "Demis Hassabis", affiliation: "CEO of DeepMind" },
            { name: "Keith Nielsen" },
            { name: "Christof Koch", affiliation: "President at Allen Institute for Brain Science" },
            { name: "Andrew Parker", affiliation: "Professor at University of Oxford" },
            { name: "Heinrich Buelthoff", affiliation: "Director at Max Planck Institute for Biological Cybernetics" },
            { name: "Alessandro Verri", affiliation: "Professor at Universita Degli Studi Di Genova" },
            { name: "Hanspeter Mallot", affiliation: "Professor at Universitat Tubingen" },
            { name: "James J. Little", affiliation: "Professor at University of British Columbia" },
            { name: "Manfred Fahle", affiliation: "Professor at Bremen University" },
            { name: "Daphna Weinshall", affiliation: "Professor at The Hebrew University of Jerusalem" },
            { name: "Shimon Edelman", affiliation: "Professor at Cornell University" },
            { name: "John G. Harris", affiliation: "Professor at University of Florida" },
            { name: "Norberto Grzywacz", affiliation: "Dean at Georgetown University" },
            { name: "Thomas Vetter", affiliation: "Professor at University of Basel" },
            { name: "Lyle Borg-Graham", affiliation: "CNRS" },
            { name: "Sebastian Tolg", affiliation: "Professor at Johannes Gutenberg-Universitat" },
            { name: "Partha Niyogi", affiliation: "Professor at University of Chicago" },
            { name: "Michael Oren" },
            { name: "Massimiliano Pontil", affiliation: "Professor at University College London" },
            { name: "Martin Giese", affiliation: "Professor at University Clinic Tubingen" },
            { name: "Bernd Heisele", affiliation: "Principal Scientist at Honda Research Institute" },
            { name: "Maximilian Riesenhuber", affiliation: "Professor at Georgetown University" },
            { name: "Sayan Mukherjee", affiliation: "Professor at Duke University" },
            { name: "Andrea Caponnetto", affiliation: "Professor at City University of Hong Kong" },
            { name: "Lior Wolf", affiliation: "Professor at Tel Aviv University" },
            { name: "Gabriel Kreiman", affiliation: "Professor at Harvard University" },
            { name: "Davide Zoccolan", affiliation: "SISSA" },
            { name: "Thomas Serre", affiliation: "Professor at Brown University" },
            { name: "Sangwan Lee", affiliation: "Professor at KAIST" },
            { name: "Neva Cherniavsky", affiliation: "Staff Scientist at Baylor College of Medicine" },
            { name: "Pavan K. Mallapragada", affiliation: "Data Shaman" },
            { name: "Jacob Bouvrie" },
            { name: "Guillermo D. Canas" },
            { name: "Fabio Anselmi", affiliation: "Istituto Italiano di Tecnologia (IIT)" },
            { name: "Amnon Shashua", affiliation: "CTO of Mobileye and Professor at The Hebrew University of Jerusalem" },
            { name: "Jose Marroquin" },
            { name: "Bror Saxberg", affiliation: "CLO of Kaplan" },
            { name: "Anya Hurlbert", affiliation: "Professor at Newcastle University" },
            { name: "Davi Geiger", affiliation: "Professor at NYU" },
            { name: "Ed Gamble", affiliation: "Principle Engineer at NASA JPL" },
            { name: "Woodward Yang", affiliation: "Professor at Harvard University" },
            { name: "Thomas Breuel", affiliation: "Google" },
            { name: "Anthony Passera", affiliation: "Technology Architect at Syncsort" },
            { name: "Brian Subirana-Vilanova", affiliation: "Professor at IESE Business School- University of Navarra" },
            { name: "James Hutchinson" },
            { name: "David Beymer", affiliation: "IBM" },
            { name: "Pawan Sinha", affiliation: "Professor at Massachusetts Institute of Technology" },
            { name: "Emanuela Bricolo", affiliation: "Professor at Istituto Italiano di Tecnologia (IIT)" },
            { name: "Robert Thau", affiliation: "Smartleaf" },
            { name: "Michael Jones", affiliation: "Senior Principal Research Scientist at Mitsubishi Electric" },
            { name: "Edgar Osuna", affiliation: "Global Head of Risk Analytics at Mercantil" },
            { name: "Constantine Papageorgiou", affiliation: "Senior Vice President at Acadian Asset Management" },
            { name: "Theodoros Evgeniou", affiliation: "Professor at INSEAD" },
            { name: "Nicholas Chan", affiliation: "Chicago Citadel" },
            { name: "Christian Shelton", affiliation: "Professor at University of California- Riverside" },
            { name: "Tony Ezzat", affiliation: "Nannigans" },
            { name: "Vinay Kumar" },
            { name: "Ryan Rifkin", affiliation: "Google" },
            { name: "Martin Szummer", affiliation: "DeepMind" },
            { name: "Gene W. Yeo", affiliation: "Professor at UCSD" },
            { name: "Alexander Rakhlin", affiliation: "Professor at University of Pennsylvania- The Wharton School" },
            { name: "Sanmay Das", affiliation: "Professor at Washington University in St. Louis" },
            { name: "Stanley Bileschi" },
            { name: "Minjoon Kouh", affiliation: "Professor at Drew University" },
            { name: "Adlar Kim" },
            { name: "Giorgos Zacharia", affiliation: "CTO of Kayak" },
            { name: "Sharat Chikkerur", affiliation: "Microsoft" },
            { name: "Ulf Knoblich", affiliation: "Scientist II at Allen Institute for Brain Science" },
            { name: "Ethan Meyers", affiliation: "Professor at Hampshire College" },
            { name: "Huei-han Jhuang" },
            { name: "Cheston Tan", affiliation: "A*STAR" },
            { name: "Joel Z. Leibo", affiliation: "Research Scientist at DeepMind" },
            { name: "Carlo Ciliberto", affiliation: "Istituto Italiano di Tecnologia (IIT)" },
            { name: "Youssef Mroueh", affiliation: "IBM" },
            { name: "Leyla Isik", affiliation: "Johns Hopkins University" },
            { name: "Charlie Frogner", affiliation: "Massachusetts Institute of Technology" },
            { name: "Jim Mutch" },
            { name: "Gemma Roig Noguera", affiliation: "Massachusetts Institute of Technology" },
            { name: "Maximilian Nickel", affiliation: "Facebook" },
            { name: "Yena Han", affiliation: "Massachusetts Institute of Technology" },
            { name: "Chiyuan Zhang", affiliation: "Massachusetts Institute of Technology" },
            { name: "Owen Lewis", affiliation: "Massachusetts Institute of Technology" },
            { name: "Andrea Tacchetti", affiliation: "Massachusetts Institute of Technology" },
            { name: "Georgios Evangelopoulos", affiliation: "Massachusetts Institute of Technology" },
        ]
    },
    {
        title: "Former Masters Students & Visitors",
        type: "list",
        members: [
            { name: "Gadi Geiger", affiliation: "Massachusetts Institute of Technology" },
            { name: "Laura Ying Schulz" },

            { name: "Sanjana Srivastava", affiliation: "Stanford University" },
            { name: "Nicole O’Brien" },
            { name: "Eric Tiffany" },
            { name: "Katie Cornog" },
            { name: "MIchael Kass", affiliation: "Senior Scientist at Pixar" },
            { name: "Jonathan Bliss" },
            { name: "Harry Voorhees" },
            { name: "Walter Gillett" },
            { name: "Terry Sanger", affiliation: "Professor at University of Southern California" },
            { name: "Mike Drumheller", affiliation: "INRIX Inc." },
            { name: "Vijay Balasubramanian", affiliation: "Professor at the University of Pennsylvania" },
            { name: "Anuj Mohan" },
            { name: "Elaine Yiu" },
            { name: "Stephen Lines" },
            { name: "Janet Marques" },
            { name: "Jon Wang" },
            { name: "Purdy Ho" },
            { name: "Andrew Crane" },
            { name: "Jennifer Huang" },
            { name: "Brian Kim" },
            { name: "Pascal Paysan" },
            { name: "Luis Perez-Breva", affiliation: "Director of MIT Innovation Teams" },
            { name: "Ezra Rosen", affiliation: "Residency at Columbia Medicine" },
            { name: "Jennifer Louie", affiliation: "Engineer at Polyvore" },
            { name: "Sanmay Das", affiliation: "Professor at Washington University in St. Louis" },
            { name: "Brian Leung" },
            { name: "Alexandros Kyriakides", affiliation: "University of Cyprus" },
            { name: "Jia (Jane) Wu" },
            { name: "Ian S. Martin", affiliation: "Bose Corporation" },
            { name: "Charles F. Cadieu", affiliation: "IQ Engines" },
            { name: "James Skelley", affiliation: "JSTechLaw" },
            { name: "Neha Soni", affiliation: "California Institute of Technology" },
            { name: "Andre Wibisono", affiliation: "University of Wisconsin" },
            { name: "Hristo Paskov", affiliation: "Stanford University" },
            { name: "Nicholas Edelman", affiliation: "Google" },
            { name: "Stav Braun", affiliation: "Dispatch" },
            { name: "Yuzhao (Allen) Ni", affiliation: "Google" },
            { name: "Chun-Kai Wang", affiliation: "University of Washington" },
            { name: "Ami Patel", affiliation: "Google" },
            { name: "Brando Miranda", affiliation: "Massachusetts Institute of Technology" },
            { name: "Michael Villalba" },
            { name: "Francis Chen", affiliation: "Palantir" },

        ]
    }
]
