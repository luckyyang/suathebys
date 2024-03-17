import React, { useEffect, useState } from "react";
// @ts-ignore
import { useMount, useUpdateEffect } from "react-use";
import styled from "styled-components";
import _ from "lodash";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";
import {
  rawEmailToBuffer,
} from "@zk-email/helpers/dist/input-helpers";
import { abi } from "../abi.json";
import { LabeledTextArea } from "../components/LabeledTextArea";
import DragAndDropTextBox from "../components/DragAndDropTextBox";
import { SingleLineInput } from "../components/SingleLineInput";
import { Button } from "../components/Button";
import { Col, Row } from "../components/Layout";
import { NumberedStep } from "../components/NumberedStep";
import { TopBanner } from "../components/TopBanner";
import { ProgressBar } from "../components/ProgressBar";

export const MainPage: React.FC<{}> = (props) => {
  const { address } = useAccount();

  const [ethereumAddress, setEthereumAddress] = useState<string>(address ?? "");
  const [decryptionCondition, setDecryptionCondition] = useState<string>("0");
  const [allowedPeekers, setAllowedPeekers] = useState<string[]>([address ?? ""]);
  const [allowedStores, setAllowedStores] = useState<string[]>([address ?? ""]);
  const [dataType, setDataType] = useState<string>("namespace");
  const [buyDataId, setBuyDataId] = useState<string>("0");
  const [buyDataKey, setBuyDataKey] = useState<string>("0");
  const [proof, setProof] = useState<string>(localStorage.proof || "");
  const [publicSignals, setPublicSignals] = useState<string>(
    localStorage.publicSignals || ""
  );
  const [displayMessage, setDisplayMessage] = useState<string>("Prove");

  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationPassed, setVerificationPassed] = useState(false);
  const [lastAction, setLastAction] = useState<"" | "sign" | "verify" | "send">(
    ""
  );
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [status, setStatus] = useState<
    | "not-started"
    | "generating-input"
    | "downloading-proof-files"
    | "generating-proof"
    | "error-bad-input"
    | "error-failed-to-download"
    | "error-failed-to-prove"
    | "done"
    | "sending-on-chain"
    | "sent"
  >("not-started");

  const [stopwatch, setStopwatch] = useState<Record<string, number>>({
    startedDownloading: 0,
    finishedDownloading: 0,
    startedProving: 0,
    finishedProving: 0,
  });

  const getRecordNum = (
  ) => {
    const { data, isError, isLoading } = useContractRead({
      // @ts-ignore
      address: import.meta.env.VITE_CONTRACT_ADDRESS,
      abi: abi,
      functionName: "numRecords",
      args: [
        // reformatProofForChain(proof),
        // publicSignals ? JSON.parse(publicSignals) : [],
        // "BTC",
      ],
    });
    return { data, isError, isLoading };
  };
  const { data: recordNum } = getRecordNum();
  console.log("recordNum: ", recordNum);

  useEffect(() => {
    if (address) {
      setEthereumAddress(address);
    } else {
      setEthereumAddress("");
    }
  }, [address]);

  const recordTimeForActivity = (activity: string) => {
    setStopwatch((prev) => ({
      ...prev,
      [activity]: Date.now(),
    }));
  };

  const { config } = usePrepareContractWrite({
    // @ts-ignore
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: abi,
    functionName: "newDataRecord",
    args: [
      0,
      [ethereumAddress],
      [ethereumAddress],
      dataType,
    ],
    enabled: true, // !!(proof && publicSignals),
    onError: (error: { message: any }) => {
      console.error("error happened: ", error.message);
      // TODO: handle errors
    },
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  // buy
  const { config: buyConfig } = usePrepareContractWrite({
    // @ts-ignore
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: abi,
    functionName: "buy",
    args: [
      buyDataId,
      // buyDataKey,
    ],
    enabled: true, // !!(proof && publicSignals),
    onError: (error: { message: any }) => {
      console.error("error happened: ", error.message);
      // TODO: handle errors
    },
  });

  const { write: buyWrite } = useContractWrite(buyConfig);

  return (
    <Container>
      <div className="title">
        <Header>
          Suathby's-Cross chain Auction house Build with SUAVE ⚡🤖
        </Header>
      </div>
      <Col
        style={{
          gap: "8px",
          maxWidth: "720px",
          margin: "0 auto",
          marginBottom: "2rem",
        }}
      >
        Sell any digital product online with crypto. Powered by Suave.
      </Col>
      <Col>
        <Header style={{ border: "2px solid black", padding: 30 }}>
          Records onsale: {String(recordNum) || 0}{" "}
        </Header>
      </Col>
      <Main>
        <Column>
          <SubHeader>Sell</SubHeader>
          <SingleLineInput
            label="decryptionCondition"
            value={decryptionCondition}
            onChange={(e) => {
              setDecryptionCondition(e.currentTarget.value);
            }}
          />
          <SingleLineInput
            label="allowedPeekers"
            value={allowedPeekers}
            onChange={(e) => {
              setAllowedPeekers(e.currentTarget.value);
            }}
          />
          <SingleLineInput
            label="allowedStores"
            value={allowedStores}
            onChange={(e) => {
              setAllowedStores(e.currentTarget.value);
            }}
          />
          <SingleLineInput
            label="dataType"
            value={dataType}
            onChange={(e) => {
              setDataType(e.currentTarget.value);
            }}
          />

          <Button
            // disabled={!verificationPassed || isLoading || isSuccess}
            onClick={async () => {
              setStatus("sending-on-chain");
              write?.();
            }}
          >
            Sell
          </Button>
        </Column>
        <Column>
          <SubHeader>Buy</SubHeader>
          <SingleLineInput
            label="buyDataId"
            value={buyDataId}
            onChange={(e) => {
              setBuyDataId(e.currentTarget.value);
            }}
          />
          <SingleLineInput
            label="buyDataKey"
            value={buyDataKey}
            onChange={(e) => {
              setBuyDataKey(e.currentTarget.value);
            }}
          />
          <Button
            // disabled={!verificationPassed || isLoading || isSuccess}
            onClick={async () => {
              setStatus("sending-on-chain");
              buyWrite?.();
            }}
          >
            Buy
          </Button>
          {isSuccess && (
            <div>
              Transaction:{" "}
              <a
                href={
                  "https://explorer.rigil.suave.flashbots.net/tx/" + data?.hash
                }
              >
                {data?.hash}
              </a>
            </div>
          )}
        </Column>
      </Main>
    </Container>
  );
};

const ProcessStatus = styled.div<{ status: string }>`
  font-size: 8px;
  padding: 8px;
  border-radius: 8px;
`;

const TimerDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 8px;
`;

const TimerDisplay = ({ timers }: { timers: Record<string, number> }) => {
  return (
    <TimerDisplayContainer>
      {timers["startedDownloading"] && timers["finishedDownloading"] ? (
        <div>
          Zkey Download time:&nbsp;
          <span data-testid="download-time">
            {timers["finishedDownloading"] - timers["startedDownloading"]}
          </span>
          ms
        </div>
      ) : (
        <div></div>
      )}
      {timers["startedProving"] && timers["finishedProving"] ? (
        <div>
          Proof generation time:&nbsp;
          <span data-testid="proof-time">
            {timers["finishedProving"] - timers["startedProving"]}
          </span>
          ms
        </div>
      ) : (
        <div></div>
      )}
    </TimerDisplayContainer>
  );
};

const Header = styled.span`
  font-weight: 600;
  margin-bottom: 1em;
  font-size: 2.25rem;
  line-height: 2.5rem;
  letter-spacing: -0.02em;
`;

const SubHeader = styled(Header)`
  font-size: 1.7em;
  margin-bottom: 16px;
`;

const Main = styled(Row)`
  width: 100%;
  gap: 1rem;
`;

const Column = styled(Col)`
  width: 100%;
  gap: 1rem;
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  & .title {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  & .main {
    & .signaturePane {
      flex: 1;
      display: flex;
      flex-direction: column;
      & > :first-child {
        height: calc(30vh + 24px);
      }
    }
  }

  & .bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    & p {
      text-align: center;
    }
    & .labeledTextAreaContainer {
      align-self: center;
      max-width: 50vw;
      width: 500px;
    }
  }
`;
