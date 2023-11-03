import OtpInput from "./otp";
import { Button } from "./ui/button";

interface ITokenForm {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const TokenForm: React.FC<ITokenForm> = ({
  error,
  setError,
  otp,
  setOtp,
  onSubmit,
}) => {
  const onChange = (value: string) => {
    setError(null);
    setOtp(value);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center space-y-8 "
    >
      <p>A code has been sent to your email</p>
      <OtpInput value={otp} valueLength={8} onChange={onChange} />
      {error ? (
        <p className="text-destructive text-sm font-medium">{error}</p>
      ) : null}
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default TokenForm;
