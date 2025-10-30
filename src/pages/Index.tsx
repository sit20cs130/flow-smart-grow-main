import { WalletGate } from "@/components/WalletGate";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  return (
    <WalletGate>
      <Dashboard />
    </WalletGate>
  );
};

export default Index;
