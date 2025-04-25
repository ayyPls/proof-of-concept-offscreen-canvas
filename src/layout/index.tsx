import { FC, PropsWithChildren } from "react";
import { FetchWorker } from "../FetchWorker";

// TODO: test if canvas rerenders if something in layout happens
const ViewerLayout: FC<PropsWithChildren> = ({children}) => {
  return (
    <main>
      {/* <section
        style={{ position: "absolute", top: 0, margin: "0 1vw", height: "5vh" }}
      >
        top section
      </section>
      <section
        style={{ position: "absolute", left: 0, margin: "0 1vw", width: "5vh" }}
      >
        left
      </section>
      <section
        style={{ position: "absolute", right: 0, margin: "0 1vw", width: "5vh" }}
      >
        right
      </section>
      <section
        style={{ position: "absolute", bottom: 0, margin: "0 1vw", height: "5vh" }}
      >
        bottom
      </section> */}
      <FetchWorker />
      {children}
    </main>
  );
};

export { ViewerLayout };
