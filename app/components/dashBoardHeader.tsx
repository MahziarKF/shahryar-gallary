interface Props {
  isAdmin: boolean;
}

export default function DashBoardHeader({ isAdmin }: Props) {
  return (
    <div className="text-sm text-gray-600">
      {isAdmin ? (
        <p className="text-green-600 font-bold">دمین سیستم</p>
      ) : (
        <p>کاربر عادی</p>
      )}
    </div>
  );
}
