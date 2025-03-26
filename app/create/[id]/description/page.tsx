import { CreateDescription } from "@/app/actions";
import { Counter } from "@/app/components/Counter";
import { CreatioBottomBar } from "@/app/components/CreationBottomBar";
import { StateLGADropdowns } from "@/app/components/StateLGADropdowns";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import nigerianStatesWithLGAs from "@/app/components/NigerianStatesWithLga";


export default function DescriptionPage({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="w-3/5 mx-auto mt-20">
        <h2 className="text-3xl font-semibold tracking-tight transition-colors">
          Please describe your home as good as you can!
        </h2>
      </div>

      <form action={CreateDescription}>
        <input type="hidden" name="homeId" value={params.id} />
        <div className="mx-auto w-3/5 mt-10 flex flex-col gap-y-5 mb-36">
          {/* Title */}
          <div className="flex flex-col gap-y-2">
            <Label>Title</Label>
            <Input
              name="title"
              type="text"
              required
              placeholder="Short and simple..."
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              required
              placeholder="Please describe your home..."
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-y-2">
            <Label>Price</Label>
            <Input
              name="price"
              type="number"
              required
              placeholder="Price per Month in Naira"
              min={10}
            />
          </div>

          {/* Image */}
          <div className="flex flex-col gap-y-2">
            <Label>Image</Label>
            <Input name="image" type="file" required />
          </div>

          {/* State and LGA Dropdowns */}
          <StateLGADropdowns statesWithLGAs={nigerianStatesWithLGAs} />

          {/* Mode Radio Buttons (Buy or Rent) */}
          <div className="flex flex-col gap-y-2">
            <Label>Mode</Label>
            <div className="flex items-center gap-x-4">
              <label className="flex items-center gap-x-2">
                <input
                  type="radio"
                  name="mode"
                  value="rent"
                  defaultChecked // Rent is selected by default
                  className="form-radio"
                />
                Rent
              </label>
              <label className="flex items-center gap-x-2">
                <input
                  type="radio"
                  name="mode"
                  value="buy"
                  className="form-radio"
                />
                Buy
              </label>
            </div>
          </div>

          {/* Type Radio Buttons (Building or Land) */}
          <div className="flex flex-col gap-y-2">
            <Label>Type</Label>
            <div className="flex items-center gap-x-4">
              <label className="flex items-center gap-x-2">
                <input
                  type="radio"
                  name="type"
                  value="building"
                  defaultChecked // Building is selected by default
                  className="form-radio"
                />
                Building
              </label>
              <label className="flex items-center gap-x-2">
                <input
                  type="radio"
                  name="type"
                  value="land"
                  className="form-radio"
                />
                Land
              </label>
            </div>
          </div>

          {/* Room Counters */}
          <Card>
            <CardHeader className="flex flex-col gap-y-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Livingrooms</h3>
                  <p className="text-muted-foreground text-sm">
                    How many livingrooms do you have?
                  </p>
                </div>
                <Counter name="livingroom" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Bedrooms</h3>
                  <p className="text-muted-foreground text-sm">
                    How many bedrooms do you have?
                  </p>
                </div>
                <Counter name="bedroom" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Bathrooms</h3>
                  <p className="text-muted-foreground text-sm">
                    How many bathrooms do you have?
                  </p>
                </div>
                <Counter name="bathroom" />
              </div>
            </CardHeader>
          </Card>
        </div>

        <CreatioBottomBar />
      </form>
    </>
  );
}