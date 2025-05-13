import ViewerTopSidebar from "@widgets/viewer/top-sidebar";
import ViewerLeftSidebar from "@widgets/viewer/left-sidebar";
import ViewerRightSidebar from "@widgets/viewer/right-sidebar";
import ViewerBottomSidebar from "@widgets/viewer/bottom-sidebar";
import { OffscreenScene } from "@widgets/viewer/offscreen-scene";

const ViewerPageLayout = () => {
  return (
    <div className="ViewerPageLayout">
      <ViewerTopSidebar />
      <ViewerLeftSidebar />
      <ViewerRightSidebar />
      <ViewerBottomSidebar />
      <OffscreenScene/>
    </div>
  );
};

export default ViewerPageLayout;
