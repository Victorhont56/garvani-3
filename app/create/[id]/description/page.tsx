import { CreateDescription } from "@/app/actions";
import { Counter } from "@/app/components/Counter";
import { CreatioBottomBar } from "@/app/components/CreationBottomBar";
import { StateLGADropdowns } from "@/app/components/StateLGADropdowns";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Nigerian states and LGAs data
const nigerianStatesWithLGAs = {
  "Abia": [
      "Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", 
      "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", 
      "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"
    ],
    "Adamawa": [
      "Demsa", "Fufure", "Ganye", "Gayuk", "Gombi", "Grie", "Hong", "Jada", "Lamurde", 
      "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", 
      "Shelleng", "Song", "Toungo", "Yola North", "Yola South"
    ],
    "Akwa Ibom": [
      "Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", 
      "Ibeno", "Ibesikpo Asutan", "Ibiono Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", 
      "Ini", "Itu", "Mbo", "Mkpat Enin", "Nsit Atai", "Nsit Ibom", "Nsit Ubium", "Obot Akara", 
      "Okobo", "Onna", "Oron", "Oruk Anam", "Udung Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", 
      "Uyo"
    ],
    "Anambra": [
      "Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", 
      "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", 
      "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", 
      "Orumba North", "Orumba South", "Oyi"
    ],
    "Bauchi": [
      "Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", 
      "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", 
      "Tafawa Balewa", "Toro", "Warji", "Zaki"
    ],
    "Bayelsa": [
      "Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", 
      "Yenagoa"
    ],
    "Benue": [
      "Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", 
      "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", 
      "Ohimini", "Oju", "Okpokwu", "Oturkpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"
    ],
    "Borno": [
      "Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", 
      "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", 
      "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", 
      "Monguno", "Ngala", "Nganzai", "Shani"
    ],
    "Cross River": [
      "Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", 
      "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", 
      "Yakuur", "Yala"
    ],
    "Delta": [
      "Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", 
      "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", 
      "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", 
      "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"
    ],
    "Ebonyi": [
      "Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", 
      "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"
    ],
    "Edo": [
      "Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", 
      "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Orhionmwon", 
      "Oredo", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"
    ],
    "Ekiti": [
      "Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", 
      "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", 
      "Ise/Orun", "Moba", "Oye"
    ],
    "Enugu": [
      "Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", 
      "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", 
      "Oji River", "Udenu", "Udi", "Uzo-Uwani"
    ],
    "FCT": [
      "Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council"
    ],
    "Gombe": [
      "Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", 
      "Nafada", "Shongom", "Yamaltu/Deba"
    ],
    "Imo": [
      "Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", 
      "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", 
      "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu", 
      "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"
    ],
    "Jigawa": [
      "Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", 
      "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kaugama", 
      "Kazaure", "Kiri Kasama", "Kiyawa", "Maigatari", "Malam Madori", "Miga", "Ringim", 
      "Roni", "Sule Tankarkar", "Taura", "Yankwashi"
    ],
    "Kaduna": [
      "Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", 
      "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", 
      "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"
    ],
    "Kano": [
      "Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", 
      "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", 
      "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", 
      "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", 
      "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", 
      "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"
    ],
    "Katsina": [
      "Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", 
      "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa", 
      "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", 
      "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", 
      "Safana", "Sandamu", "Zango"
    ],
    "Kebbi": [
      "Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", 
      "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", 
      "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"
    ],
    "Kogi": [
      "Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu", 
      "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", "Okehi", 
      "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"
    ],
    "Kwara": [
      "Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", 
      "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", 
      "Pategi"
    ],
    "Lagos": [
      "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", 
      "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", 
      "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", 
      "Surulere"
    ],
    "Nasarawa": [
      "Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", 
      "Nasarawa Egon", "Obi", "Toto", "Wamba"
    ],
    "Niger": [
      "Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", 
      "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", 
      "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"
    ],
    "Ogun": [
      "Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South", 
      "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", 
      "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", 
      "Remo North", "Shagamu"
    ],
    "Ondo": [
      "Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West", 
      "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo", 
      "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"
    ],
    "Osun": [
      "Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire", "Boluwaduro", 
      "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ife Central", "Ife East", 
      "Ife North", "Ife South", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", 
      "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", 
      "Oriade", "Orolu", "Osogbo"
    ],
    "Oyo": [
      "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East", 
      "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", 
      "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", 
      "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", 
      "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", 
      "Saki West", "Surulere"
    ],
    "Plateau": [
      "Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam", 
      "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", 
      "Riyom", "Shendam", "Wase"
    ],
    "Rivers": [
      "Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", 
      "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana", 
      "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", 
      "Oyigbo", "Port Harcourt", "Tai"
    ],
    "Sokoto": [
      "Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", 
      "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", 
      "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", 
      "Wurno", "Yabo"
    ],
    "Taraba": [
      "Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", 
      "Kurmi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"
    ],
    "Yobe": [
      "Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", 
      "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", 
      "Yunusari", "Yusufari"
    ],
    "Zamfara": [
      "Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", 
      "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", 
      "Chafe", "Zurmi"
    ]    
};

export default function DescriptionPage({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="w-3/5 mx-auto mt-20">
        <h2 className="text-3xl font-semibold tracking-tight transition-colors">
          Please describe your home as good as you can!
        </h2>
      </div>

      <form action={CreateDescription}>
        <input type="hidden" name="homeId" value={params.id} />
        <div className="mx-auto w-3/5 mt-10 flex flex-col gap-y-5 mb-36">
          {/* Title */}
          <div className="flex flex-col gap-y-2">
            <Label>Title</Label>
            <Input
              name="title"
              type="text"
              required
              placeholder="Short and simple..."
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              required
              placeholder="Please describe your home..."
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-y-2">
            <Label>Price</Label>
            <Input
              name="price"
              type="number"
              required
              placeholder="Price per Month in Naira"
              min={10}
            />
          </div>

          {/* Image */}
          <div className="flex flex-col gap-y-2">
            <Label>Image</Label>
            <Input name="image" type="file" required />
          </div>

          {/* State and LGA Dropdowns */}
          <StateLGADropdowns statesWithLGAs={nigerianStatesWithLGAs} />

          {/* Mode Radio Buttons (Buy or Rent) */}
          <div className="flex flex-col gap-y-2">
            <Label>Mode</Label>
            <div className="flex items-center gap-x-4">
              <label className="flex items-center gap-x-2">
                <input
                  type="radio"
                  name="mode"
                  value="rent"
                  defaultChecked // Rent is selected by default
                  className="form-radio"
                />
                Rent
              </label>
              <label className="flex items-center gap-x-2">
                <input
                  type="radio"
                  name="mode"
                  value="buy"
                  className="form-radio"
                />
                Buy
              </label>
            </div>
          </div>

          {/* Type Radio Buttons (Building or Land) */}
          <div className="flex flex-col gap-y-2">
            <Label>Type</Label>
            <div className="flex items-center gap-x-4">
              <label className="flex items-center gap-x-2">
                <input
                  type="radio"
                  name="type"
                  value="building"
                  defaultChecked // Building is selected by default
                  className="form-radio"
                />
                Building
              </label>
              <label className="flex items-center gap-x-2">
                <input
                  type="radio"
                  name="type"
                  value="land"
                  className="form-radio"
                />
                Land
              </label>
            </div>
          </div>

          {/* Room Counters */}
          <Card>
            <CardHeader className="flex flex-col gap-y-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Livingrooms</h3>
                  <p className="text-muted-foreground text-sm">
                    How many livingrooms do you have?
                  </p>
                </div>
                <Counter name="livingroom" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Bedrooms</h3>
                  <p className="text-muted-foreground text-sm">
                    How many bedrooms do you have?
                  </p>
                </div>
                <Counter name="bedroom" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Bathrooms</h3>
                  <p className="text-muted-foreground text-sm">
                    How many bathrooms do you have?
                  </p>
                </div>
                <Counter name="bathroom" />
              </div>
            </CardHeader>
          </Card>
        </div>

        <CreatioBottomBar />
      </form>
    </>
  );
}