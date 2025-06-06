/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type { BaseContract, BigNumber, BytesLike, Signer, utils } from "ethers";
import type { EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export type EarthfastSlotStruct = {
  last: PromiseOrValue<boolean>;
  next: PromiseOrValue<boolean>;
};

export type EarthfastSlotStructOutput = [boolean, boolean] & {
  last: boolean;
  next: boolean;
};

export interface EarthfastNodesImplInterface extends utils.Interface {
  functions: {};

  events: {
    "NodeDisabledChanged(bytes32,bool,bool)": EventFragment;
    "NodeHostChanged(bytes32,string,string,string,string)": EventFragment;
    "NodePriceChanged(bytes32,uint256,uint256,uint256,tuple)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "NodeDisabledChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NodeHostChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NodePriceChanged"): EventFragment;
}

export interface NodeDisabledChangedEventObject {
  nodeId: string;
  oldDisabled: boolean;
  newDisabled: boolean;
}
export type NodeDisabledChangedEvent = TypedEvent<
  [string, boolean, boolean],
  NodeDisabledChangedEventObject
>;

export type NodeDisabledChangedEventFilter =
  TypedEventFilter<NodeDisabledChangedEvent>;

export interface NodeHostChangedEventObject {
  nodeId: string;
  oldHost: string;
  oldRegion: string;
  newHost: string;
  newRegion: string;
}
export type NodeHostChangedEvent = TypedEvent<
  [string, string, string, string, string],
  NodeHostChangedEventObject
>;

export type NodeHostChangedEventFilter = TypedEventFilter<NodeHostChangedEvent>;

export interface NodePriceChangedEventObject {
  nodeId: string;
  oldLastPrice: BigNumber;
  oldNextPrice: BigNumber;
  newPrice: BigNumber;
  slot: EarthfastSlotStructOutput;
}
export type NodePriceChangedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber, EarthfastSlotStructOutput],
  NodePriceChangedEventObject
>;

export type NodePriceChangedEventFilter =
  TypedEventFilter<NodePriceChangedEvent>;

export interface EarthfastNodesImpl extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: EarthfastNodesImplInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {};

  callStatic: {};

  filters: {
    "NodeDisabledChanged(bytes32,bool,bool)"(
      nodeId?: PromiseOrValue<BytesLike> | null,
      oldDisabled?: null,
      newDisabled?: null
    ): NodeDisabledChangedEventFilter;
    NodeDisabledChanged(
      nodeId?: PromiseOrValue<BytesLike> | null,
      oldDisabled?: null,
      newDisabled?: null
    ): NodeDisabledChangedEventFilter;

    "NodeHostChanged(bytes32,string,string,string,string)"(
      nodeId?: PromiseOrValue<BytesLike> | null,
      oldHost?: null,
      oldRegion?: null,
      newHost?: null,
      newRegion?: null
    ): NodeHostChangedEventFilter;
    NodeHostChanged(
      nodeId?: PromiseOrValue<BytesLike> | null,
      oldHost?: null,
      oldRegion?: null,
      newHost?: null,
      newRegion?: null
    ): NodeHostChangedEventFilter;

    "NodePriceChanged(bytes32,uint256,uint256,uint256,tuple)"(
      nodeId?: PromiseOrValue<BytesLike> | null,
      oldLastPrice?: null,
      oldNextPrice?: null,
      newPrice?: null,
      slot?: null
    ): NodePriceChangedEventFilter;
    NodePriceChanged(
      nodeId?: PromiseOrValue<BytesLike> | null,
      oldLastPrice?: null,
      oldNextPrice?: null,
      newPrice?: null,
      slot?: null
    ): NodePriceChangedEventFilter;
  };

  estimateGas: {};

  populateTransaction: {};
}
