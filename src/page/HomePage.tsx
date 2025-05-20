import GuestBanner from "../components/guest/banner/banner";
import GuestIntroduce from "../components/guest/introduce/introduce";
import { motion } from "framer-motion";

export default function HomePage(){
    return (
        <div>
        <GuestBanner />
              <div className="flex justify-center">
        <motion.div
          className="w-full h-[3px] bg-gradient-to-r from-red-300 via-red-800 to-red-300"
          animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "400% 100%",
          }}
        />
      </div>
        <GuestIntroduce />
        </div>
    )
}