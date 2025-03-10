import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        book: 'Book Demo',
        tracking: 'Tracking',
        compliance: 'Compliance',
        dashboard: 'Dashboard',
      },
      common: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
      },
      home: {
        hero: {
          badge: 'Nordic SME Logistics',
          title: 'Simplified Logistics for Small Businesses',
          description: 'Book, track, and manage your shipments from a single platform at a fixed rate of €10 per parcel. Faster than phone calls, simpler than enterprise software.',
          bookButton: 'Book a Demo',
          viewDashboard: 'View Dashboard',
        },
        benefits: {
          reliable: {
            title: 'Reliable Service',
            description: '99.8% on-time delivery across the Nordic region'
          },
          fast: {
            title: 'Fast Delivery',
            description: 'Next-day delivery available for urban areas'
          },
          coverage: {
            title: 'Nordic Coverage',
            description: 'Seamless shipping across all Nordic countries'
          }
        },
        features: {
          title: 'Why Choose E-Parsel?',
          description: 'We simplify logistics for small and medium enterprises across the Nordic region.',
          fixedRate: {
            title: 'Fixed €10 Rate',
            subtitle: 'Transparent pricing with no hidden fees',
            description: 'Book shipments to any Nordic destination for a flat €10 rate per parcel. Save up to 30% compared to direct carrier pricing.',
          },
          tracking: {
            title: 'Real-time Tracking',
            subtitle: 'Monitor your shipments 24/7',
            description: 'Get live updates on your shipment status with real-time map tracking and automated SMS/email notifications.',
          },
          dashboard: {
            title: 'Unified Dashboard',
            subtitle: 'Connect with your 3PL provider',
            description: 'Access shipment history, analytics, and document management in one place. Seamlessly communicate with your logistics provider.',
          },
        },
        cta: {
          title: 'Ready to Simplify Your Shipping?',
          description: 'Join hundreds of SMEs across the Nordic region who trust E-Parsel for their shipping needs.',
          button: 'Book Your Demo',
        },
      },
      tracking: {
        title: 'Track Your Shipment',
        placeholder: 'Enter tracking number (e.g., EP12345678)',
        track: 'Track',
        trackingNumber: 'Tracking Number',
        from: 'From',
        to: 'To',
        carrier: 'Carrier',
        estimatedDelivery: 'Estimated Delivery',
        trackingHistory: 'Tracking History',
        needHelp: 'Need Help?',
        helpText: 'If you have any questions about your shipment, please contact our customer service at support@e-parsel.com or call +46 123 456 789.',
        status: {
          inTransit: 'In Transit',
          delivered: 'Delivered',
          pending: 'Pending',
          exception: 'Exception'
        },
        events: {
          pickedUp: 'Picked up from sender',
          departed: 'Departed facility',
          arrivedSorting: 'Arrived at sorting center',
          departedFacility: 'Departed facility',
          arrivedDestination: 'Arrived at destination facility',
          outForDelivery: 'Out for delivery',
          delivered: 'Delivered'
        }
      },
      booking: {
        title: 'Book a Shipment',
        packageDetails: 'Package Details',
        weight: 'Weight (kg)',
        dimensions: {
          length: 'Length (cm)',
          width: 'Width (cm)',
          height: 'Height (cm)',
        },
        locations: 'Locations',
        pickupAddress: 'Pickup Address',
        deliveryAddress: 'Delivery Address',
        deliveryOptions: 'Delivery Options',
        standard: 'Standard (3 days)',
        compliance: 'Add Compliance Package (+€2)',
        learnMore: 'Learn more',
        calculateRate: 'Calculate Rate',
        fixedRate: 'Fixed Rate Shipping',
        carrier: 'E-Parsel Nordic',
        eta: 'Estimated delivery: 3 days',
        bookNow: 'Book Now',
        aboutRates: 'About our rates',
        ratesDescription: 'All shipments include tracking and insurance up to €500. Additional insurance can be purchased during checkout. Rates shown include all taxes and fees.',
        shipmentReady: 'Shipment Ready to Book',
        shipmentFrom: 'Your shipment from',
        shipmentTo: 'to',
        shipmentReady2: 'is ready to be booked with E-Parsel Nordic.',
        total: 'Total:',
        confirmBooking: 'Confirm Booking',
        signInToBook: 'Sign In to Book',
      },
      compliance: {
        title: 'Compliance Package',
        description: 'Our Compliance Package ensures your shipments meet all regulatory requirements for cross-border shipping within the Nordic region. This service includes all necessary documentation, customs clearance assistance, and ensures adherence to local regulations.',
        included: "What's Included",
        documentation: {
          title: 'Documentation Preparation',
          description: 'All required customs and shipping documents prepared on your behalf',
        },
        customs: {
          title: 'Customs Clearance',
          description: 'Expedited customs processing and clearance assistance',
        },
        tax: {
          title: 'Tax & Duty Calculation',
          description: 'Accurate calculation of applicable taxes and duties',
        },
        regulatory: {
          title: 'Regulatory Compliance',
          description: 'Verification that shipments meet all relevant regulations',
        },
        pricing: 'Pricing',
        package: 'Compliance Package',
        addedTo: 'Added to any shipment',
        perPackage: 'per package',
        faq: 'Frequently Asked Questions',
        whenNeeded: {
          question: 'When do I need the Compliance Package?',
          answer: "It's recommended for all cross-border shipments, especially for commercial goods, but is optional for personal items of low value.",
        },
        guarantee: {
          question: "Does this guarantee my package won't have customs issues?",
          answer: 'While it significantly reduces the risk of delays and issues, final decisions rest with customs authorities.',
        },
        howToAdd: {
          question: 'How do I add this to my shipment?',
          answer: 'Simply select the Compliance Package option during the booking process.',
        },
        viewStatus: 'View Compliance Status in Dashboard',
      },
      dashboard: {
        title: 'Dashboard',
        subtitle: 'Manage your shipments and view analytics',
        newShipment: 'New Shipment',
        uploadFile: 'Upload File',
        tabs: {
          overview: 'Overview',
          shipments: 'Shipments',
          documents: 'Documents',
          analytics: 'Analytics',
        },
        stats: {
          totalShipments: 'Total Shipments',
          onTimeDelivery: 'On-Time Delivery',
          activeShipments: 'Active Shipments',
          nextPickup: 'Next Pickup',
          from: 'from last month',
          scheduled: 'Scheduled for',
        },
        recentShipments: {
          title: 'Recent Shipments',
          subtitle: 'Your latest 5 shipments',
          to: 'to',
          viewAll: 'View All Shipments',
        },
        deliveryPerformance: {
          title: 'Delivery Performance',
          subtitle: 'On-time vs delayed deliveries',
          onTime: 'On Time',
          delayed: 'Delayed',
        },
        shipmentHistory: {
          title: 'Shipment History',
          subtitle: 'View and manage all your shipments',
          trackingId: 'Tracking ID',
          date: 'Date',
          from: 'From',
          to: 'To',
          status: 'Status',
          actions: 'Actions',
          view: 'View',
        },
        documentManagement: {
          title: 'Document Management',
          subtitle: 'Upload and manage your shipping documents',
          upload: 'Upload Documents',
          dragDrop: 'Drag and drop files here or click to browse',
          selectFiles: 'Select Files',
          supported: 'Supported formats: PDF, CSV, Excel, JPG',
          recent: 'Recent Documents',
          uploaded: 'Uploaded:',
        },
        analytics: {
          shippingVolume: {
            title: 'Shipping Volume',
            subtitle: 'Monthly shipping volume trend',
          },
          topDestinations: {
            title: 'Top Destinations',
            subtitle: 'Most frequent delivery locations',
          },
          costBreakdown: {
            title: 'Cost Breakdown',
            subtitle: 'Shipping expenses by category',
            standard: 'Standard Shipping',
            express: 'Express Delivery',
            compliance: 'Compliance Services',
          },
        },
      },
      footer: {
        description: 'Simplified logistics solutions for SMEs.',
        services: 'Services',
        company: 'Company',
        about: 'About Us',
        contact: 'Contact',
        terms: 'Terms of Service',
        contactInfo: {
          email: 'Email:',
          phone: 'Phone:',
          address: 'Address:',
        },
        rights: 'All rights reserved.',
      },
    },
  },
  sv: {
    translation: {
      nav: {
        home: 'Hem',
        book: 'Boka Demo',
        tracking: 'Spårning',
        compliance: 'Efterlevnad',
        dashboard: 'Översikt',
      },
      common: {
        signIn: 'Logga In',
        signUp: 'Registrera',
      },
      home: {
        hero: {
          badge: 'Nordisk SMF-Logistik',
          title: 'Förenklad Logistik för Småföretag',
          description: 'Boka, spåra och hantera dina försändelser från en enda plattform till en fast avgift på 10 € per paket. Snabbare än telefonsamtal, enklare än företagsmjukvara.',
          bookButton: 'Boka en Demo',
          viewDashboard: 'Visa Översikt',
        },
        benefits: {
          reliable: {
            title: 'Pålitlig Service',
            description: '99,8% leverans i tid över hela Norden'
          },
          fast: {
            title: 'Snabb Leverans',
            description: 'Leverans nästa dag tillgänglig för stadsområden'
          },
          coverage: {
            title: 'Nordisk Täckning',
            description: 'Sömlös frakt över alla nordiska länder'
          }
        },
        features: {
          title: 'Varför Välja E-Parsel?',
          description: 'Vi förenklar logistik för små och medelstora företag i hela Norden.',
          fixedRate: {
            title: 'Fast Taxa 10 €',
            subtitle: 'Transparent prissättning utan dolda avgifter',
            description: 'Boka försändelser till alla nordiska destinationer för en fast taxa på 10 € per paket. Spara upp till 30% jämfört med direkta transportörpriser.',
          },
          tracking: {
            title: 'Realtidsspårning',
            subtitle: 'Övervaka dina försändelser dygnet runt',
            description: 'Få direktuppdateringar om din försändelsestatus med realtidskartspårning och automatiserade SMS/e-postaviseringar.',
          },
          dashboard: {
            title: 'Enhetlig Översikt',
            subtitle: 'Anslut till din tredjepartslogistikleverantör',
            description: 'Få tillgång till försändelsehistorik, analyser och dokumenthantering på ett ställe. Kommunicera smidigt med din logistikleverantör.',
          },
        },
        cta: {
          title: 'Redo att Förenkla din Frakt?',
          description: 'Gå med hundratals små och medelstora företag i Norden som litar på E-Parsel för sina fraktbehov.',
          button: 'Boka Din Demo',
        },
      },
      tracking: {
        title: 'Spåra Din Försändelse',
        placeholder: 'Ange spårningsnummer (t.ex. EP12345678)',
        track: 'Spåra',
        trackingNumber: 'Spårningsnummer',
        from: 'Från',
        to: 'Till',
        carrier: 'Transportör',
        estimatedDelivery: 'Beräknad Leverans',
        trackingHistory: 'Spårningshistorik',
        needHelp: 'Behöver du Hjälp?',
        helpText: 'Om du har några frågor om din försändelse, kontakta vår kundtjänst på support@e-parsel.com eller ring +46 123 456 789.',
        status: {
          inTransit: 'Under Transport',
          delivered: 'Levererad',
          pending: 'Väntar',
          exception: 'Problem'
        },
        events: {
          pickedUp: 'Hämtad från avsändare',
          departed: 'Lämnat anläggning',
          arrivedSorting: 'Anlänt till sorteringscentral',
          departedFacility: 'Lämnat anläggning',
          arrivedDestination: 'Anlänt till destinationsanläggning',
          outForDelivery: 'Ute för leverans',
          delivered: 'Levererad'
        }
      },
      booking: {
        title: 'Boka en Försändelse',
        packageDetails: 'Paketdetaljer',
        weight: 'Vikt (kg)',
        dimensions: {
          length: 'Längd (cm)',
          width: 'Bredd (cm)',
          height: 'Höjd (cm)',
        },
        locations: 'Platser',
        pickupAddress: 'Upphämtningsadress',
        deliveryAddress: 'Leveransadress',
        deliveryOptions: 'Leveransalternativ',
        standard: 'Standard (3 dagar)',
        compliance: 'Lägg till Efterlevnadspaket (+2 €)',
        learnMore: 'Läs mer',
        calculateRate: 'Beräkna Taxa',
        fixedRate: 'Fast Taxa Frakt',
        carrier: 'E-Parsel Nordic',
        eta: 'Beräknad leverans: 3 dagar',
        bookNow: 'Boka Nu',
        aboutRates: 'Om våra taxor',
        ratesDescription: 'Alla försändelser inkluderar spårning och försäkring upp till 500 €. Ytterligare försäkring kan köpas vid utcheckning. Visade priser inkluderar alla skatter och avgifter.',
        shipmentReady: 'Försändelse Redo att Bokas',
        shipmentFrom: 'Din försändelse från',
        shipmentTo: 'till',
        shipmentReady2: 'är redo att bokas med E-Parsel Nordic.',
        total: 'Totalt:',
        confirmBooking: 'Bekräfta Bokning',
        signInToBook: 'Logga In för att Boka',
      },
      compliance: {
        title: 'Efterlevnadspaket',
        description: 'Vårt Efterlevnadspaket säkerställer att dina försändelser uppfyller alla regulatoriska krav för gränsöverskridande frakt inom Norden. Denna tjänst inkluderar all nödvändig dokumentation, tullklareringshjälp och säkerställer efterlevnad av lokala förordningar.',
        included: 'Vad Ingår',
        documentation: {
          title: 'Dokumentationsförberedelse',
          description: 'Alla nödvändiga tull- och fraktdokument förbereds åt dig',
        },
        customs: {
          title: 'Tullklarering',
          description: 'Påskyndad tullhantering och klareringshjälp',
        },
        tax: {
          title: 'Skatte- & Tullberäkning',
          description: 'Noggrann beräkning av tillämpliga skatter och tullar',
        },
        regulatory: {
          title: 'Regelefterlevnad',
          description: 'Verifiering att försändelser uppfyller alla relevanta förordningar',
        },
        pricing: 'Prissättning',
        package: 'Efterlevnadspaket',
        addedTo: 'Läggs till alla försändelser',
        perPackage: 'per paket',
        faq: 'Vanliga Frågor',
        whenNeeded: {
          question: 'När behöver jag Efterlevnadspaketet?',
          answer: 'Det rekommenderas för alla gränsöverskridande försändelser, särskilt för kommersiella varor, men är valfritt för personliga föremål av lågt värde.',
        },
        guarantee: {
          question: 'Garanterar detta att mitt paket inte får tullproblem?',
          answer: 'Även om det avsevärt minskar risken för förseningar och problem, vilar slutliga beslut hos tullmyndigheterna.',
        },
        howToAdd: {
          question: 'Hur lägger jag till detta till min försändelse?',
          answer: 'Välj helt enkelt alternativet Efterlevnadspaket under bokningsprocessen.',
        },
        viewStatus: 'Visa Efterlevnadsstatus i Översikten',
      },
      dashboard: {
        title: 'Översikt',
        subtitle: 'Hantera dina försändelser och visa analyser',
        newShipment: 'Ny Försändelse',
        uploadFile: 'Ladda Upp Fil',
        tabs: {
          overview: 'Översikt',
          shipments: 'Försändelser',
          documents: 'Dokument',
          analytics: 'Analyser',
        },
        stats: {
          totalShipments: 'Totala Försändelser',
          onTimeDelivery: 'Leverans i Tid',
          activeShipments: 'Aktiva Försändelser',
          nextPickup: 'Nästa Upphämtning',
          from: 'från förra månaden',
          scheduled: 'Schemalagd för',
        },
        recentShipments: {
          title: 'Senaste Försändelser',
          subtitle: 'Dina senaste 5 försändelser',
          to: 'till',
          viewAll: 'Visa Alla Försändelser',
        },
        deliveryPerformance: {
          title: 'Leveransprestanda',
          subtitle: 'I tid vs försenade leveranser',
          onTime: 'I Tid',
          delayed: 'Försenad',
        },
        shipmentHistory: {
          title: 'Försändelsehistorik',
          subtitle: 'Visa och hantera alla dina försändelser',
          trackingId: 'Spårnings-ID',
          date: 'Datum',
          from: 'Från',
          to: 'Till',
          status: 'Status',
          actions: 'Åtgärder',
          view: 'Visa',
        },
        documentManagement: {
          title: 'Dokumenthantering',
          subtitle: 'Ladda upp och hantera dina fraktdokument',
          upload: 'Ladda Upp Dokument',
          dragDrop: 'Dra och släpp filer här eller klicka för att bläddra',
          selectFiles: 'Välj Filer',
          supported: 'Stödda format: PDF, CSV, Excel, JPG',
          recent: 'Senaste Dokument',
          uploaded: 'Uppladdat:',
        },
        analytics: {
          shippingVolume: {
            title: 'Fraktvolym',
            subtitle: 'Månatlig trend för fraktvolym',
          },
          topDestinations: {
            title: 'Toppdestinationer',
            subtitle: 'Mest frekventa leveransplatser',
          },
          costBreakdown: {
            title: 'Kostnadsfördelning',
            subtitle: 'Fraktkostnader per kategori',
            standard: 'Standardfrakt',
            express: 'Expresslevererans',
            compliance: 'Efterlevnadstjänster',
          },
        },
      },
      footer: {
        description: 'Förenklade logistiklösningar för små och medelstora företag.',
        services: 'Tjänster',
        company: 'Företag',
        about: 'Om Oss',
        contact: 'Kontakt',
        terms: 'Användarvillkor',
        contactInfo: {
          email: 'E-post:',
          phone: 'Telefon:',
          address: 'Adress:',
        },
        rights: 'Alla rättigheter förbehållna.',
      },
    },
  },
  fi: {
    translation: {
      nav: {
        home: 'Etusivu',
        book: 'Varaa Demo',
        tracking: 'Seuranta',
        compliance: 'Vaatimustenmukaisuus',
        dashboard: 'Hallintapaneeli',
      },
      common: {
        signIn: 'Kirjaudu Sisään',
        signUp: 'Rekisteröidy',
      },
      home: {
        hero: {
          badge: 'Pohjoismainen PK-Logistiikka',
          title: 'Yksinkertaistettua Logistiikkaa Pienyrityksille',
          description: 'Varaa, seuraa ja hallinnoi lähetyksiäsi yhdeltä alustalta kiinteään 10 € hintaan per paketti. Nopeampaa kuin puhelut, yksinkertaisempaa kuin yritysohjelmat.',
          bookButton: 'Varaa Demo',
          viewDashboard: 'Näytä Hallintapaneeli',
        },
        benefits: {
          reliable: {
            title: 'Luotettava Palvelu',
            description: '99,8% toimituksista ajallaan Pohjoismaissa'
          },
          fast: {
            title: 'Nopea Toimitus',
            description: 'Seuraavan päivän toimitus saatavilla kaupunkialueilla'
          },
          coverage: {
            title: 'Pohjoismainen Kattavuus',
            description: 'Saumaton toimitus kaikissa Pohjoismaissa'
          }
        },
        features: {
          title: 'Miksi Valita E-Parsel?',
          description: 'Yksinkertaistamme logistiikkaa pienille ja keskisuurille yrityksille Pohjoismaissa.',
          fixedRate: {
            title: 'Kiinteä 10 € Hinta',
            subtitle: 'Läpinäkyvä hinnoittelu ilman piilokustannuksia',
            description: 'Varaa lähetyksiä mihin tahansa Pohjoismaiseen kohteeseen kiinteällä 10 € hinnalla per paketti. Säästä jopa 30 % verrattuna suoraan kuljetusyhtiöiden hintoihin.',
          },
          tracking: {
            title: 'Reaaliaikainen Seuranta',
            subtitle: 'Seuraa lähetyksiäsi 24/7',
            description: 'Saa reaaliaikaisia päivityksiä lähetyksesi tilasta karttaseurannalla ja automaattisilla SMS/sähköposti-ilmoituksilla.',
          },
          dashboard: {
            title: 'Yhtenäinen Hallintapaneeli',
            subtitle: 'Yhdistä logistiikkapalvelujen tarjoajaasi',
            description: 'Pääsy lähetyshistoriaan, analytiikkaan ja asiakirjahallintaan yhdessä paikassa. Saumaton viestintä logistiikkapalveluntarjoajasi kanssa.',
          },
        },
        cta: {
          title: 'Valmis Yksinkertaistamaan Lähetyksiäsi?',
          description: 'Liity satoihin pohjoismaisiin pk-yrityksiin, jotka luottavat E-Parsel-palveluun lähetystarpeissaan.',
          button: 'Varaa Ensimmäinen Lähetyksesi',
        },
      },
      tracking: {
        title: 'Seuraa Lähetystäsi',
        placeholder: 'Syötä seurantanumero (esim. EP12345678)',
        track: 'Seuraa',
        trackingNumber: 'Seurantanumero',
        from: 'Lähettäjä',
        to: 'Vastaanottaja',
        carrier: 'Kuljetusyritys',
        estimatedDelivery: 'Arvioitu Toimitus',
        trackingHistory: 'Seurantahistoria',
        needHelp: 'Tarvitsetko Apua?',
        helpText: 'Jos sinulla on kysyttävää lähetyksestäsi, ota yhteyttä asiakaspalveluumme osoitteessa support@e-parsel.com tai soita +46 123 456 789.',
        status: {
          inTransit: 'Kuljetuksessa',
          delivered: 'Toimitettu',
          pending: 'Odottaa',
          exception: 'Poikkeus'
        },
        events: {
          pickedUp: 'Noudettu lähettäjältä',
          departed: 'Lähtenyt toimipaikasta',
          arrivedSorting: 'Saapunut lajittelukeskukseen',
          departedFacility: 'Lähtenyt toimipaikasta',
          arrivedDestination: 'Saapunut määränpään toimipaikkaan',
          outForDelivery: 'Jakelussa',
          delivered: 'Toimitettu'
        }
      },
      booking: {
        title: 'Varaa Lähetys',
        packageDetails: 'Paketin Tiedot',
        weight: 'Paino (kg)',
        dimensions: {
          length: 'Pituus (cm)',
          width: 'Leveys (cm)',
          height: 'Korkeus (cm)',
        },
        locations: 'Sijainnit',
        pickupAddress: 'Nouto-osoite',
        deliveryAddress: 'Toimitusosoite',
        deliveryOptions: 'Toimitusvaihtoehdot',
        standard: 'Standardi (3 päivää)',
        compliance: 'Lisää Vaatimustenmukaisuuspaketti (+2 €)',
        learnMore: 'Lue lisää',
        calculateRate: 'Laske Hinta',
        fixedRate: 'Kiinteä Hinta Lähetyksille',
        carrier: 'E-Parsel Nordic',
        eta: 'Arvioitu toimitus: 3 päivää',
        bookNow: 'Varaa Nyt',
        aboutRates: 'Tietoa hinnoistamme',
        ratesDescription: 'Kaikki lähetykset sisältävät seurannan ja vakuutuksen 500 € asti. Lisävakuutuksia voi ostaa kassalla. Näytetyt hinnat sisältävät kaikki verot ja maksut.',
        shipmentReady: 'Lähetys Valmis Varattavaksi',
        shipmentFrom: 'Lähetyksesi kohteesta',
        shipmentTo: 'kohteeseen',
        shipmentReady2: 'on valmis varattavaksi E-Parsel Nordic -palvelulla.',
        total: 'Yhteensä:',
        confirmBooking: 'Vahvista Varaus',
        signInToBook: 'Kirjaudu Sisään Varataksesi',
      },
      compliance: {
        title: 'Vaatimustenmukaisuuspaketti',
        description: 'Vaatimustenmukaisuuspakettimme varmistaa, että lähetyksesi täyttävät kaikki rajat ylittävän lähetyksen sääntelyvaatimukset Pohjoismaissa. Tämä palvelu sisältää kaikki tarvittavat asiakirjat, tulliselvitysavun ja varmistaa paikallisten määräysten noudattamisen.',
        included: 'Mitä Sisältyy',
        documentation: {
          title: 'Asiakirjojen Valmistelu',
          description: 'Kaikki tarvittavat tulli- ja lähetysasiakirjat valmistetaan puolestasi',
        },
        customs: {
          title: 'Tulliselvitys',
          description: 'Nopeutettu tullien käsittely ja selvitysapu',
        },
        tax: {
          title: 'Vero- ja Tullilaskenta',
          description: 'Tarkka sovellettavien verojen ja tullien laskenta',
        },
        regulatory: {
          title: 'Sääntelynmukaisuus',
          description: 'Varmistus, että lähetykset täyttävät kaikki asiaankuuluvat määräykset',
        },
        pricing: 'Hinnoittelu',
        package: 'Vaatimustenmukaisuuspaketti',
        addedTo: 'Lisätty mihin tahansa lähetykseen',
        perPackage: 'per paketti',
        faq: 'Usein Kysytyt Kysymykset',
        whenNeeded: {
          question: 'Milloin tarvitsen Vaatimustenmukaisuuspaketin?',
          answer: 'Sitä suositellaan kaikille rajat ylittäville lähetyksille, erityisesti kaupallisille tavaroille, mutta se on valinnainen vähäarvoisille henkilökohtaisille tavaroille.',
        },
        guarantee: {
          question: 'Takaako tämä, ettei pakettini kohtaa tulliongelmia?',
          answer: 'Vaikka se merkittävästi vähentää viivästysten ja ongelmien riskiä, lopulliset päätökset ovat tulliviranomaisten käsissä.',
        },
        howToAdd: {
          question: 'Miten lisään tämän lähetykseni?',
          answer: 'Valitse yksinkertaisesti Vaatimustenmukaisuuspaketti-vaihtoehto varaamisprosessin aikana.',
        },
        viewStatus: 'Näytä Vaatimustenmukaisuuden Tila Hallintapaneelissa',
      },
      dashboard: {
        title: 'Hallintapaneeli',
        subtitle: 'Hallinnoi lähetyksiäsi ja tarkastele analytiikkaa',
        newShipment: 'Uusi Lähetys',
        uploadFile: 'Lataa Tiedosto',
        tabs: {
          overview: 'Yleiskatsaus',
          shipments: 'Lähetykset',
          documents: 'Asiakirjat',
          analytics: 'Analytiikka',
        },
        stats: {
          totalShipments: 'Lähetykset Yhteensä',
          onTimeDelivery: 'Ajallaan Toimitus',
          activeShipments: 'Aktiiviset Lähetykset',
          nextPickup: 'Seuraava Nouto',
          from: 'edellisestä kuukaudesta',
          scheduled: 'Aikataulutettu',
        },
        recentShipments: {
          title: 'Viimeisimmät Lähetykset',
          subtitle: 'Viimeisimmät 5 lähetystäsi',
          to: 'vastaanottaja',
          viewAll: 'Näytä Kaikki Lähetykset',
        },
        deliveryPerformance: {
          title: 'Toimituksen Suorituskyky',
          subtitle: 'Ajallaan vs. viivästyneet toimitukset',
          onTime: 'Ajallaan',
          delayed: 'Viivästynyt',
        },
        shipmentHistory: {
          title: 'Lähetyshistoria',
          subtitle: 'Tarkastele ja hallinnoi kaikkia lähetyksiäsi',
          trackingId: 'Seurantatunnus',
          date: 'Päivämäärä',
          from: 'Lähettäjä',
          to: 'Vastaanottaja',
          status: 'Tila',
          actions: 'Toiminnot',
          view: 'Näytä',
        },
        documentManagement: {
          title: 'Asiakirjahallinta',
          subtitle: 'Lataa ja hallinnoi lähetysasiakirjojasi',
          upload: 'Lataa Asiakirjoja',
          dragDrop: 'Vedä ja pudota tiedostoja tähän tai napsauta selataksesi',
          selectFiles: 'Valitse Tiedostot',
          supported: 'Tuetut muodot: PDF, CSV, Excel, JPG',
          recent: 'Viimeisimmät Asiakirjat',
          uploaded: 'Ladattu:',
        },
        analytics: {
          shippingVolume: {
            title: 'Lähetysvolyymi',
            subtitle: 'Kuukausittainen lähetysvolyymin trendi',
          },
          topDestinations: {
            title: 'Suosituimmat Kohteet',
            subtitle: 'Yleisimmät toimituspaikat',
          },
          costBreakdown: {
            title: 'Kustannuserittely',
            subtitle: 'Lähetyskulut kategorioittain',
            standard: 'Standardilähetys',
            express: 'Pikakuljetus',
            compliance: 'Vaatimustenmukaisuuspalvelut',
          },
        },
      },
      footer: {
        description: 'Yksinkertaistettuja logistiikkaratkaisuja pk-yrityksille.',
        services: 'Palvelut',
        company: 'Företag',
        about: 'Om Oss',
        contact: 'Kontakt',
        terms: 'Användarvillkor',
        contactInfo: {
          email: 'Sähköposti:',
          phone: 'Puhelin:',
          address: 'Osoite:',
        },
        rights: 'Kaikki oikeudet pidätetään.',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
