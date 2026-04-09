"use client"
import { StaticImageData } from "next/image"
import Link from "next/link"
import Lightbox from "yet-another-react-lightbox"
import { useState } from "react"

import gallery_1 from "@/assets/imgs/footer/footer-1.png"
import gallery_2 from "@/assets/imgs/footer/footer-2.png"
import gallery_3 from "@/assets/imgs/footer/footer-3.png"
import gallery_4 from "@/assets/imgs/footer/footer-4.png"

const gallery_data: StaticImageData[] = [gallery_1, gallery_2, gallery_3, gallery_4];

const FooterOne = () => {

   const [open, setOpen] = useState(false)
   const [index, setIndex] = useState(0)

   // const handleOpen = (i: number) => {
   //    setIndex(i)
   //    setOpen(true)
   // }

   const slides = gallery_data.map((img) => ({
      src: img.src,
   }))

   return (
      <>
         <footer>
            <div className="footer-main bg-color-1 p-relative">
               <div className="footer-shape-1" style={{ backgroundImage: `url(/assets/imgs/footer/shape-f-1.png)` }}></div>
               <div className="footer-shape-2" style={{ backgroundImage: `url(/assets/imgs/footer/shape-f-2.png)` }}></div>

               <div className="small-container">
                  <div className="footer-bottom pt-30 pb-30">
                     <div className="center-area p-relative">
                        <span>© 2025 StrongWood. Todos los derechos reservados. Desarrollado por <Link href="https://www.mrostagnol.com/google/ads">Rostagnol Media</Link></span>
                     </div>

                  </div>
               </div>
            </div>
         </footer>
         <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={slides}
            index={index}
            on={{
               view: ({ index }) => setIndex(index),
            }}
         />
      </>
   )
}

export default FooterOne
