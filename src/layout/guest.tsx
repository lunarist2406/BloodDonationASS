import GuestFooter from "../components/guest/footer/GuestFooter";
import GuestHeader from "../components/guest/header/Header";
import GuestBanner from "../components/guest/banner/banner";

export default function GuestLayout(
) {
  return (
    <div>
      <GuestHeader/>
      <GuestBanner/>
      <GuestFooter />
    </div>
  );
}
