"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Switch } from "@/src/components/ui/switch";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { DateRange } from "react-day-picker";
import DateRangePicker from "@/src/components/ui/calendar-v2";
import { toast } from "sonner";

type CreateAnnouncementProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateAnnouncement = ({
  open,
  onOpenChange,
}: CreateAnnouncementProps) => {
  const [audience, setAudience] = useState<string>("");
  const [scheduleForLater, setScheduleForLater] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>(
    undefined
  );
  const [showDiscard, setShowDiscard] = useState(false);
  const [showLaunch, setShowLaunch] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>
              Create and schedule announcements for KEDCO mobile app users.
            </DialogDescription>
          </DialogHeader>

          <hr />

          <div className="space-y-6">
            <div className="flex flex-col gap-1.75">
              <label className="text-sm font-normal">Title</label>
              <Input
                placeholder="Title"
                className="focus-visible:ring-0 bg-surface-muted h-12.5 border-0 text-neutral-input-text text-[13px] placeholder:text-neutral-input-text placeholder:text-[13px]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-col gap-1.75">
                <label className="text-sm font-normal">Message Body</label>
                <div className="rounded-md">
                  <div className="flex gap-2 h-9.5 bg-surface-subtle">
                    <span>B</span>
                    <span>I</span>
                    <span>U</span>
                    <span>S</span>
                  </div>

                  <Textarea
                    placeholder="Textarea"
                    className="border-0 focus-visible:ring-0 h-40 resize-none bg-surface-muted text-neutral-input-text text-[13px] placeholder:text-neutral-input-text placeholder:text-[13px]"
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">0/120 characters</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.75">
                <label className="text-sm font-normal">Channel</label>
                <Select>
                  <SelectTrigger className="bg-surface-muted h-10 w-full text-neutral-input-text">
                    <SelectValue placeholder="--Select channel--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-app">In-App</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.75">
                <label className="text-sm font-medium">Audience</label>
                <Select onValueChange={(val) => setAudience(val)}>
                  <SelectTrigger className="bg-surface-muted h-10 w-full text-neutral-input-text">
                    <SelectValue placeholder="--Select audience--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="prepaid">Prepaid Users</SelectItem>
                    <SelectItem value="postpaid">Postpaid Users</SelectItem>
                    <SelectItem value="location">Location-Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {audience === "location" && (
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.75">
                  <label className="text-sm font-normal">Location Type</label>
                  <Select>
                    <SelectTrigger className="bg-surface-muted h-10 w-full text-neutral-input-text">
                      <SelectValue placeholder="-- Select location type --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="state">State</SelectItem>
                      <SelectItem value="city">City/LGA</SelectItem>
                      <SelectItem value="feeder">Feeder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.75">
                  <label className="text-sm font-normal">
                    Location Selector
                  </label>
                  <Select>
                    <SelectTrigger className="bg-surface-muted h-10 w-full text-neutral-input-text">
                      <SelectValue placeholder="--Select audience--" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nassarawa">Nassarawa</SelectItem>
                      <SelectItem value="taurani">Taurani</SelectItem>
                      <SelectItem value="ungogo">Ungogo</SelectItem>
                      <SelectItem value="gwale">Gwale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {audience === "location" && (
              <div className="flex items-start gap-2 border-[0.5px] border-dashed border-warning-mustard bg-[rgba(254,246,231,0.67)] rounded-[10px] p-3 text-xs text-grey-text">
                <Image
                  src="/icons/warning-info.svg"
                  width={19}
                  height={19}
                  alt="warning-info"
                />
                <p>
                  This announcement will be sent to users who have saved at
                  least one meter or billing account in the selected location
                </p>
              </div>
            )}

            {scheduleForLater && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.75">
                  <label className="text-sm font-normal">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="flex items-center gap-2 bg-surface-muted h-10 w-full px-3 rounded-md cursor-pointer">
                        <Image
                          src="/icons/calendar.svg"
                          width={16}
                          height={16}
                          alt="calendar"
                        />
                        <span className="text-sm text-neutral-input-text">
                          {selectedDate?.from
                            ? selectedDate.from.toLocaleDateString()
                            : "Today"}
                        </span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DateRangePicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-1.75">
                  <label className="text-sm font-normal">Time</label>
                  <div className="relative w-full">
                    <Image
                      src="/icons/clock.svg"
                      width={12}
                      height={12}
                      alt="clock"
                      className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4"
                    />
                    <Select>
                      <SelectTrigger className="pl-9 bg-surface-muted h-10 w-full text-neutral-input-text">
                        <SelectValue placeholder="4:00 PM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4:15pm">4:15 PM</SelectItem>
                        <SelectItem value="4:30pm">4:30 PM</SelectItem>
                        <SelectItem value="4:45pm">4:45 PM</SelectItem>
                        <SelectItem value="5:00pm">5:00 PM</SelectItem>
                        <SelectItem value="5:15pm">5:15 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Switch
                checked={scheduleForLater}
                onCheckedChange={setScheduleForLater}
              />
              <span className="text-sm">Schedule for later</span>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="secondary"
                className="text-primary bg-light-blue"
                onClick={() => toast.success("Draft saved successfully.")}
              >
                Save as Draft
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="px-6 text-text-heading font-semibold text-[13px]"
                  onClick={() => {
                    onOpenChange(false);
                    setShowDiscard(true);
                  }}
                >
                  Discard
                </Button>
                <Button
                  className="px-6 font-semibold text-[13px]"
                  onClick={() => {
                    onOpenChange(false);
                    setShowLaunch(true);
                  }}
                >
                  Launch
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDiscard} onOpenChange={setShowDiscard}>
        <DialogContent className="max-w-sm p-9.5">
          <div className="flex justify-center">
            <Image
              src="/icons/warning-v4.svg"
              width={60}
              height={58}
              alt="caution"
            />
          </div>
          <DialogTitle className="text-center">
            Discard announcement?
          </DialogTitle>
          <DialogDescription className="text-center">
            You have unsaved changes. Are you sure you want to discard this
            announcement?
          </DialogDescription>

          <div className="flex justify-center items-center gap-4">
            <Button
              variant="outline"
              className="px-6 text-text-heading font-semibold text-[13px] flex-1"
              onClick={() => {
                setShowDiscard(false);
                toast.success("Draft discarded");
              }}
            >
              Discard
            </Button>
            <Button
              className="px-6 font-semibold text-[13px] flex-1"
              onClick={() => {
                onOpenChange(true);
              }}
            >
              Continue editing
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showLaunch} onOpenChange={setShowLaunch}>
        <DialogContent className="max-w-sm p-9.5">
          <div className="flex justify-center">
            <Image
              src="/icons/warning-v4.svg"
              width={60}
              height={58}
              alt="caution"
            />
          </div>
          <DialogTitle className="text-center">Send announcement?</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to send this announcement? It will be
            immediately visible to the selected users.
          </DialogDescription>

          <div className="flex justify-center items-center gap-4">
            <Button
              variant="outline"
              className="px-6 text-text-heading font-semibold text-[13px] flex-1"
              onClick={() => {
                onOpenChange(true);
              }}
            >
              Cancel
            </Button>
            <Button
              className="px-6 font-semibold text-[13px] flex-1"
              onClick={() => {
                setShowLaunch(false);
                if (scheduleForLater && selectedDate?.from) {
                  toast.success(
                    `Announcement scheduled for ${selectedDate.from.toLocaleDateString()} & time.`
                  );
                } else {
                  toast.success("Announcement sent successfully.");
                }
              }}
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateAnnouncement;
