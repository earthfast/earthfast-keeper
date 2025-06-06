/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
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

export type EarthfastNodeStruct = {
  id: PromiseOrValue<BytesLike>;
  operatorId: PromiseOrValue<BytesLike>;
  host: PromiseOrValue<string>;
  region: PromiseOrValue<string>;
  disabled: PromiseOrValue<boolean>;
  prices: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>];
  projectIds: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>];
};

export type EarthfastNodeStructOutput = [
  string,
  string,
  string,
  string,
  boolean,
  [BigNumber, BigNumber],
  [string, string]
] & {
  id: string;
  operatorId: string;
  host: string;
  region: string;
  disabled: boolean;
  prices: [BigNumber, BigNumber];
  projectIds: [string, string];
};

export interface EarthfastReservationsInterface extends utils.Interface {
  functions: {
    "DEFAULT_ADMIN_ROLE()": FunctionFragment;
    "IMPORTER_ROLE()": FunctionFragment;
    "createReservations(bytes32,bytes32[],uint256[],(bool,bool))": FunctionFragment;
    "deleteReservationImpl(address,address,bytes32,bytes32,(bool,bool))": FunctionFragment;
    "deleteReservations(bytes32,bytes32[],(bool,bool))": FunctionFragment;
    "getRegistry()": FunctionFragment;
    "getReservationCount(bytes32)": FunctionFragment;
    "getReservations(bytes32,uint256,uint256)": FunctionFragment;
    "getRoleAdmin(bytes32)": FunctionFragment;
    "grantRole(bytes32,address)": FunctionFragment;
    "hasRole(bytes32,address)": FunctionFragment;
    "initialize(address[],address,bool)": FunctionFragment;
    "pause()": FunctionFragment;
    "paused()": FunctionFragment;
    "proxiableUUID()": FunctionFragment;
    "removeProjectNodeIdImpl(bytes32,bytes32)": FunctionFragment;
    "renounceRole(bytes32,address)": FunctionFragment;
    "revokeRole(bytes32,address)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "unpause()": FunctionFragment;
    "unsafeImportData((bytes32,bytes32,string,string,bool,uint256[2],bytes32[2])[],bool)": FunctionFragment;
    "unsafeSetRegistry(address)": FunctionFragment;
    "upgradeTo(address)": FunctionFragment;
    "upgradeToAndCall(address,bytes)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "DEFAULT_ADMIN_ROLE"
      | "IMPORTER_ROLE"
      | "createReservations"
      | "deleteReservationImpl"
      | "deleteReservations"
      | "getRegistry"
      | "getReservationCount"
      | "getReservations"
      | "getRoleAdmin"
      | "grantRole"
      | "hasRole"
      | "initialize"
      | "pause"
      | "paused"
      | "proxiableUUID"
      | "removeProjectNodeIdImpl"
      | "renounceRole"
      | "revokeRole"
      | "supportsInterface"
      | "unpause"
      | "unsafeImportData"
      | "unsafeSetRegistry"
      | "upgradeTo"
      | "upgradeToAndCall"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "IMPORTER_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "createReservations",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>[],
      PromiseOrValue<BigNumberish>[],
      EarthfastSlotStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "deleteReservationImpl",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      EarthfastSlotStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "deleteReservations",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>[],
      EarthfastSlotStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getRegistry",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getReservationCount",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "getReservations",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      PromiseOrValue<string>[],
      PromiseOrValue<string>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "removeProjectNodeIdImpl",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "unsafeImportData",
    values: [EarthfastNodeStruct[], PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: "unsafeSetRegistry",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeTo",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;

  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "IMPORTER_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createReservations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deleteReservationImpl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deleteReservations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getReservationCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getReservations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeProjectNodeIdImpl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "unsafeImportData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unsafeSetRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;

  events: {
    "AdminChanged(address,address)": EventFragment;
    "BeaconUpgraded(address)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "Paused(address)": EventFragment;
    "ReservationCreated(bytes32,bytes32,bytes32,uint256,uint256,tuple)": EventFragment;
    "ReservationDeleted(bytes32,bytes32,bytes32,uint256,uint256,tuple)": EventFragment;
    "RoleAdminChanged(bytes32,bytes32,bytes32)": EventFragment;
    "RoleGranted(bytes32,address,address)": EventFragment;
    "RoleRevoked(bytes32,address,address)": EventFragment;
    "Unpaused(address)": EventFragment;
    "Upgraded(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ReservationCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ReservationDeleted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
}

export interface AdminChangedEventObject {
  previousAdmin: string;
  newAdmin: string;
}
export type AdminChangedEvent = TypedEvent<
  [string, string],
  AdminChangedEventObject
>;

export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>;

export interface BeaconUpgradedEventObject {
  beacon: string;
}
export type BeaconUpgradedEvent = TypedEvent<
  [string],
  BeaconUpgradedEventObject
>;

export type BeaconUpgradedEventFilter = TypedEventFilter<BeaconUpgradedEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface PausedEventObject {
  account: string;
}
export type PausedEvent = TypedEvent<[string], PausedEventObject>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

export interface ReservationCreatedEventObject {
  nodeId: string;
  operatorId: string;
  projectId: string;
  lastPrice: BigNumber;
  nextPrice: BigNumber;
  slot: EarthfastSlotStructOutput;
}
export type ReservationCreatedEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber, EarthfastSlotStructOutput],
  ReservationCreatedEventObject
>;

export type ReservationCreatedEventFilter =
  TypedEventFilter<ReservationCreatedEvent>;

export interface ReservationDeletedEventObject {
  nodeId: string;
  operatorId: string;
  projectId: string;
  lastPrice: BigNumber;
  nextPrice: BigNumber;
  slot: EarthfastSlotStructOutput;
}
export type ReservationDeletedEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber, EarthfastSlotStructOutput],
  ReservationDeletedEventObject
>;

export type ReservationDeletedEventFilter =
  TypedEventFilter<ReservationDeletedEvent>;

export interface RoleAdminChangedEventObject {
  role: string;
  previousAdminRole: string;
  newAdminRole: string;
}
export type RoleAdminChangedEvent = TypedEvent<
  [string, string, string],
  RoleAdminChangedEventObject
>;

export type RoleAdminChangedEventFilter =
  TypedEventFilter<RoleAdminChangedEvent>;

export interface RoleGrantedEventObject {
  role: string;
  account: string;
  sender: string;
}
export type RoleGrantedEvent = TypedEvent<
  [string, string, string],
  RoleGrantedEventObject
>;

export type RoleGrantedEventFilter = TypedEventFilter<RoleGrantedEvent>;

export interface RoleRevokedEventObject {
  role: string;
  account: string;
  sender: string;
}
export type RoleRevokedEvent = TypedEvent<
  [string, string, string],
  RoleRevokedEventObject
>;

export type RoleRevokedEventFilter = TypedEventFilter<RoleRevokedEvent>;

export interface UnpausedEventObject {
  account: string;
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export interface UpgradedEventObject {
  implementation: string;
}
export type UpgradedEvent = TypedEvent<[string], UpgradedEventObject>;

export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;

export interface EarthfastReservations extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: EarthfastReservationsInterface;

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

  functions: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    IMPORTER_ROLE(overrides?: CallOverrides): Promise<[string]>;

    createReservations(
      projectId: PromiseOrValue<BytesLike>,
      nodeIds: PromiseOrValue<BytesLike>[],
      maxPrices: PromiseOrValue<BigNumberish>[],
      slot: EarthfastSlotStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    deleteReservationImpl(
      allNodes: PromiseOrValue<string>,
      projects: PromiseOrValue<string>,
      projectId: PromiseOrValue<BytesLike>,
      nodeId: PromiseOrValue<BytesLike>,
      slot: EarthfastSlotStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    deleteReservations(
      projectId: PromiseOrValue<BytesLike>,
      nodeIds: PromiseOrValue<BytesLike>[],
      slot: EarthfastSlotStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getRegistry(overrides?: CallOverrides): Promise<[string]>;

    getReservationCount(
      projectId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getReservations(
      projectId: PromiseOrValue<BytesLike>,
      skip: PromiseOrValue<BigNumberish>,
      size: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [EarthfastNodeStructOutput[]] & { result: EarthfastNodeStructOutput[] }
    >;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    initialize(
      admins: PromiseOrValue<string>[],
      registry: PromiseOrValue<string>,
      grantImporterRole: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    proxiableUUID(overrides?: CallOverrides): Promise<[string]>;

    removeProjectNodeIdImpl(
      projectId: PromiseOrValue<BytesLike>,
      nodeId: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    unsafeImportData(
      nodes: EarthfastNodeStruct[],
      revokeImporterRole: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    unsafeSetRegistry(
      registry: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    upgradeTo(
      newImplementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  IMPORTER_ROLE(overrides?: CallOverrides): Promise<string>;

  createReservations(
    projectId: PromiseOrValue<BytesLike>,
    nodeIds: PromiseOrValue<BytesLike>[],
    maxPrices: PromiseOrValue<BigNumberish>[],
    slot: EarthfastSlotStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  deleteReservationImpl(
    allNodes: PromiseOrValue<string>,
    projects: PromiseOrValue<string>,
    projectId: PromiseOrValue<BytesLike>,
    nodeId: PromiseOrValue<BytesLike>,
    slot: EarthfastSlotStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  deleteReservations(
    projectId: PromiseOrValue<BytesLike>,
    nodeIds: PromiseOrValue<BytesLike>[],
    slot: EarthfastSlotStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getRegistry(overrides?: CallOverrides): Promise<string>;

  getReservationCount(
    projectId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getReservations(
    projectId: PromiseOrValue<BytesLike>,
    skip: PromiseOrValue<BigNumberish>,
    size: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<EarthfastNodeStructOutput[]>;

  getRoleAdmin(
    role: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  grantRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  initialize(
    admins: PromiseOrValue<string>[],
    registry: PromiseOrValue<string>,
    grantImporterRole: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  pause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  proxiableUUID(overrides?: CallOverrides): Promise<string>;

  removeProjectNodeIdImpl(
    projectId: PromiseOrValue<BytesLike>,
    nodeId: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  renounceRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  unpause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  unsafeImportData(
    nodes: EarthfastNodeStruct[],
    revokeImporterRole: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  unsafeSetRegistry(
    registry: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  upgradeTo(
    newImplementation: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  upgradeToAndCall(
    newImplementation: PromiseOrValue<string>,
    data: PromiseOrValue<BytesLike>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    IMPORTER_ROLE(overrides?: CallOverrides): Promise<string>;

    createReservations(
      projectId: PromiseOrValue<BytesLike>,
      nodeIds: PromiseOrValue<BytesLike>[],
      maxPrices: PromiseOrValue<BigNumberish>[],
      slot: EarthfastSlotStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    deleteReservationImpl(
      allNodes: PromiseOrValue<string>,
      projects: PromiseOrValue<string>,
      projectId: PromiseOrValue<BytesLike>,
      nodeId: PromiseOrValue<BytesLike>,
      slot: EarthfastSlotStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    deleteReservations(
      projectId: PromiseOrValue<BytesLike>,
      nodeIds: PromiseOrValue<BytesLike>[],
      slot: EarthfastSlotStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    getRegistry(overrides?: CallOverrides): Promise<string>;

    getReservationCount(
      projectId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getReservations(
      projectId: PromiseOrValue<BytesLike>,
      skip: PromiseOrValue<BigNumberish>,
      size: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<EarthfastNodeStructOutput[]>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    initialize(
      admins: PromiseOrValue<string>[],
      registry: PromiseOrValue<string>,
      grantImporterRole: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    pause(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    proxiableUUID(overrides?: CallOverrides): Promise<string>;

    removeProjectNodeIdImpl(
      projectId: PromiseOrValue<BytesLike>,
      nodeId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    unpause(overrides?: CallOverrides): Promise<void>;

    unsafeImportData(
      nodes: EarthfastNodeStruct[],
      revokeImporterRole: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    unsafeSetRegistry(
      registry: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeTo(
      newImplementation: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AdminChanged(address,address)"(
      previousAdmin?: null,
      newAdmin?: null
    ): AdminChangedEventFilter;
    AdminChanged(
      previousAdmin?: null,
      newAdmin?: null
    ): AdminChangedEventFilter;

    "BeaconUpgraded(address)"(
      beacon?: PromiseOrValue<string> | null
    ): BeaconUpgradedEventFilter;
    BeaconUpgraded(
      beacon?: PromiseOrValue<string> | null
    ): BeaconUpgradedEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "Paused(address)"(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    "ReservationCreated(bytes32,bytes32,bytes32,uint256,uint256,tuple)"(
      nodeId?: PromiseOrValue<BytesLike> | null,
      operatorId?: PromiseOrValue<BytesLike> | null,
      projectId?: PromiseOrValue<BytesLike> | null,
      lastPrice?: null,
      nextPrice?: null,
      slot?: null
    ): ReservationCreatedEventFilter;
    ReservationCreated(
      nodeId?: PromiseOrValue<BytesLike> | null,
      operatorId?: PromiseOrValue<BytesLike> | null,
      projectId?: PromiseOrValue<BytesLike> | null,
      lastPrice?: null,
      nextPrice?: null,
      slot?: null
    ): ReservationCreatedEventFilter;

    "ReservationDeleted(bytes32,bytes32,bytes32,uint256,uint256,tuple)"(
      nodeId?: PromiseOrValue<BytesLike> | null,
      operatorId?: PromiseOrValue<BytesLike> | null,
      projectId?: PromiseOrValue<BytesLike> | null,
      lastPrice?: null,
      nextPrice?: null,
      slot?: null
    ): ReservationDeletedEventFilter;
    ReservationDeleted(
      nodeId?: PromiseOrValue<BytesLike> | null,
      operatorId?: PromiseOrValue<BytesLike> | null,
      projectId?: PromiseOrValue<BytesLike> | null,
      lastPrice?: null,
      nextPrice?: null,
      slot?: null
    ): ReservationDeletedEventFilter;

    "RoleAdminChanged(bytes32,bytes32,bytes32)"(
      role?: PromiseOrValue<BytesLike> | null,
      previousAdminRole?: PromiseOrValue<BytesLike> | null,
      newAdminRole?: PromiseOrValue<BytesLike> | null
    ): RoleAdminChangedEventFilter;
    RoleAdminChanged(
      role?: PromiseOrValue<BytesLike> | null,
      previousAdminRole?: PromiseOrValue<BytesLike> | null,
      newAdminRole?: PromiseOrValue<BytesLike> | null
    ): RoleAdminChangedEventFilter;

    "RoleGranted(bytes32,address,address)"(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleGrantedEventFilter;
    RoleGranted(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleGrantedEventFilter;

    "RoleRevoked(bytes32,address,address)"(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleRevokedEventFilter;
    RoleRevoked(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleRevokedEventFilter;

    "Unpaused(address)"(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;

    "Upgraded(address)"(
      implementation?: PromiseOrValue<string> | null
    ): UpgradedEventFilter;
    Upgraded(
      implementation?: PromiseOrValue<string> | null
    ): UpgradedEventFilter;
  };

  estimateGas: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    IMPORTER_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    createReservations(
      projectId: PromiseOrValue<BytesLike>,
      nodeIds: PromiseOrValue<BytesLike>[],
      maxPrices: PromiseOrValue<BigNumberish>[],
      slot: EarthfastSlotStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    deleteReservationImpl(
      allNodes: PromiseOrValue<string>,
      projects: PromiseOrValue<string>,
      projectId: PromiseOrValue<BytesLike>,
      nodeId: PromiseOrValue<BytesLike>,
      slot: EarthfastSlotStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    deleteReservations(
      projectId: PromiseOrValue<BytesLike>,
      nodeIds: PromiseOrValue<BytesLike>[],
      slot: EarthfastSlotStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getRegistry(overrides?: CallOverrides): Promise<BigNumber>;

    getReservationCount(
      projectId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getReservations(
      projectId: PromiseOrValue<BytesLike>,
      skip: PromiseOrValue<BigNumberish>,
      size: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      admins: PromiseOrValue<string>[],
      registry: PromiseOrValue<string>,
      grantImporterRole: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>;

    removeProjectNodeIdImpl(
      projectId: PromiseOrValue<BytesLike>,
      nodeId: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    unsafeImportData(
      nodes: EarthfastNodeStruct[],
      revokeImporterRole: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    unsafeSetRegistry(
      registry: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    upgradeTo(
      newImplementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DEFAULT_ADMIN_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    IMPORTER_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    createReservations(
      projectId: PromiseOrValue<BytesLike>,
      nodeIds: PromiseOrValue<BytesLike>[],
      maxPrices: PromiseOrValue<BigNumberish>[],
      slot: EarthfastSlotStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    deleteReservationImpl(
      allNodes: PromiseOrValue<string>,
      projects: PromiseOrValue<string>,
      projectId: PromiseOrValue<BytesLike>,
      nodeId: PromiseOrValue<BytesLike>,
      slot: EarthfastSlotStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    deleteReservations(
      projectId: PromiseOrValue<BytesLike>,
      nodeIds: PromiseOrValue<BytesLike>[],
      slot: EarthfastSlotStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getRegistry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getReservationCount(
      projectId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getReservations(
      projectId: PromiseOrValue<BytesLike>,
      skip: PromiseOrValue<BigNumberish>,
      size: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      admins: PromiseOrValue<string>[],
      registry: PromiseOrValue<string>,
      grantImporterRole: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeProjectNodeIdImpl(
      projectId: PromiseOrValue<BytesLike>,
      nodeId: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    unsafeImportData(
      nodes: EarthfastNodeStruct[],
      revokeImporterRole: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    unsafeSetRegistry(
      registry: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    upgradeTo(
      newImplementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
