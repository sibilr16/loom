function Loader({ size = "md" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-[5px]",
  };

  return (
    <div
      className={`
        rounded-full
        border-zinc-300
        border-t-black
        animate-spin
        ${sizes[size]}
      `}
    />
  );
}

export default Loader;
