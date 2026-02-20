import React from "react";
import { Text, View } from "react-native";
import { DetailsRow } from "./details-row";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { getItemDetailsByBarcodeWithAdvanceFeature } from "@/data-access-layer/get-item";

type ScannedItemCardHeader = {
  title: string;
  description?: string;
};

type ScannedItemCardProps = {
  header: ScannedItemCardHeader;
  item: NonNullable<
    Awaited<
      ReturnType<typeof getItemDetailsByBarcodeWithAdvanceFeature>
    >["data"]
  >;
};

export const ItemDetails = ({ header, item }: ScannedItemCardProps) => {
  return (
    <Card className="bg-white border-muted my-1 p-3 gap-4">
      <CardHeader className="flex-row items-center justify-between px-0">
        <View>
          <CardTitle className="text-black">{header.title}</CardTitle>
          <CardDescription className="text-black">
            {header.description || "628155"}
          </CardDescription>
        </View>

        <View className="flex-row items-center gap-2 px-0">
          <ItemPriceUnit price={item.price} uom={item?.unitName || "N/A"} />
        </View>
      </CardHeader>

      <CardContent className="flex-col gap-2 px-0 py-0">
        <DetailsRow
          icon={{ library: "FontAwesome", name: "hashtag" }}
          label="Item Code"
          value={item?.item_code ?? "N/A"}
        />
        <DetailsRow
          icon={{ library: "FontAwesome", name: "file-text" }}
          label="description"
          value={item?.description ?? "N/A"}
        />
      </CardContent>
    </Card>
  );
};

type ItemPriceUnitProps = {
  price?: number;
  uom?: string;
} & React.ComponentProps<typeof Text>;

const ItemPriceUnit = ({ price, uom, ...props }: ItemPriceUnitProps) => {
  return (
    <Badge
      variant="outline"
      className="border-muted-foreground rounded-full px-4"
    >
      <Text {...props} className="text-center text-sm font-bold">
        SAR {price ?? 0} / {uom ?? "".toUpperCase()}
      </Text>
    </Badge>
  );
};
