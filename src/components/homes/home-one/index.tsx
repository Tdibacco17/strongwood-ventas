import Banner from "./Banner"
import Features from "./Features"
import About from "./About"
import Service from "./Service"
import Process from "./Process"
import TextSlider from "./TextSlider"
import Testimonial from "./Testimonial"
import FooterOne from "@/layouts/footers/FooterOne"

const HomeOne = () => {
  return (
    <>
      <main>
        <Banner />
        <Features style={true} />
        <About style={false} />
        <Service style={false} />
        <Process style={false} />
        <TextSlider style={false}/>
        <Testimonial />
      </main>
      <FooterOne />
    </>
  )
}

export default HomeOne
