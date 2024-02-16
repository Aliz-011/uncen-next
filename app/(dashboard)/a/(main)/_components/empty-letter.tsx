import Image from 'next/image';

export const EmptyLetter = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/file-plus-dynamic-color.png"
        alt="empty"
        width={140}
        height={140}
      />
      <h2 className="text-2xl font-semibold mt-6">No letter found!</h2>
    </div>
  );
};
