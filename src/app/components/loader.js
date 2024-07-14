"use-client";

export default function Loader() {
  return (
    <div class="w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css"
        integrity="sha512-PgQMlq+nqFLV4ylk1gwUOgm6CtIIXkKwaIHp/PAIWHzig/lKZSEGKEysh0TCVbHJXCLN7WetD8TFecIky75ZfQ=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <div class="flex justify-center items-center mt-[50vh]">
        <div class="fas fa-circle-notch fa-spin fa-5x text-violet-600"></div>
      </div>
    </div>
  );
}
