const Error404 = () => {
  return (
    <div>
      <div
        style={{
          backgroundImage: "url(/bg.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "100vh",
        }}
        className="d-flex justify-content-center align-items-center"
      >
        <div className="text-center p-7 overflow-hidden align-items-center">
          <div className="mb-10"></div>
          <div>
            <h3>404 Page Not Found or File Not Found</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;
