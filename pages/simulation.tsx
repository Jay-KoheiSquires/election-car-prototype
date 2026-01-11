/**
 * 料金シミュレーションページ
 */
import { SimulationControl } from "../features/simulation/simulationControl";
import Seo from "../component/atoms/Seo";

const Simulation = () => {
  return (
    <>
      <Seo
        title="料金シミュレーション"
        description="選挙カーのレンタル料金をリアルタイムで計算。車種・オプション・配送先を選んで即座に見積もり。統一地方選挙・一般地方選挙・衆参選挙に対応。"
      />
      <SimulationControl />
    </>
  );
};

export default Simulation;
