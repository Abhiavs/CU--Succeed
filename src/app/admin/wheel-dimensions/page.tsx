"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type WheelDimension = {
  id: string;
  name: string;
  assessmentType: "PRE" | "POST";
  sortOrder: number;
  isActive: boolean;
};

export default function WheelDimensionsPage() {
  const [wheelType, setWheelType] =
    useState<"PRE" | "POST">("PRE");

  const [dimensions, setDimensions] =
    useState<WheelDimension[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [newDimension, setNewDimension] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editingName, setEditingName] =
    useState("");

  /*
   * ============================================================
   * LOAD DIMENSIONS
   * ============================================================
   */

  const loadDimensions = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/wheel/dimensions?type=${wheelType}`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load dimensions"
        );
      }

      setDimensions(
        data.dimensions || []
      );
    } catch (error) {
      console.error(
        "Failed to load dimensions:",
        error
      );

      alert(
        "Unable to load wheel dimensions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDimensions();
  }, [wheelType]);

  /*
   * ============================================================
   * ADD DIMENSION
   * ============================================================
   */

  const handleAddDimension =
    async () => {
      if (!newDimension.trim()) {
        alert(
          "Please enter a dimension name"
        );

        return;
      }

      try {
        setSaving(true);

        const response =
          await fetch(
            "/api/wheel/dimensions",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                name:
                  newDimension.trim(),

                assessmentType:
                  wheelType,

                sortOrder:
                  dimensions.length + 1,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to create dimension"
          );
        }

        setNewDimension("");

        await loadDimensions();
      } catch (error) {
        console.error(
          "Failed to add dimension:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Unable to add dimension"
        );
      } finally {
        setSaving(false);
      }
    };

  /*
   * ============================================================
   * START EDIT
   * ============================================================
   */

  const handleStartEdit = (
    dimension: WheelDimension
  ) => {
    setEditingId(
      dimension.id
    );

    setEditingName(
      dimension.name
    );
  };

  /*
   * ============================================================
   * SAVE EDIT
   * ============================================================
   */

  const handleSaveEdit =
    async (
      dimensionId: string
    ) => {
      if (!editingName.trim()) {
        alert(
          "Dimension name cannot be empty"
        );

        return;
      }

      try {
        setSaving(true);

        const response =
          await fetch(
            `/api/wheel/dimensions/${dimensionId}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                name:
                  editingName.trim(),
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to update dimension"
          );
        }

        setEditingId(null);

        setEditingName("");

        await loadDimensions();
      } catch (error) {
        console.error(
          "Failed to update dimension:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Unable to update dimension"
        );
      } finally {
        setSaving(false);
      }
    };

  /*
   * ============================================================
   * TOGGLE ACTIVE
   * ============================================================
   */

  const handleToggleActive =
    async (
      dimension: WheelDimension
    ) => {
      try {
        const response =
          await fetch(
            `/api/wheel/dimensions/${dimension.id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                isActive:
                  !dimension.isActive,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to update dimension"
          );
        }

        await loadDimensions();
      } catch (error) {
        console.error(
          "Failed to update dimension:",
          error
        );

        alert(
          "Unable to update dimension"
        );
      }
    };

  /*
   * ============================================================
   * DELETE
   * ============================================================
   */

  const handleDelete =
    async (
      dimensionId: string
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this dimension?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const response =
          await fetch(
            `/api/wheel/dimensions/${dimensionId}`,
            {
              method: "DELETE",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to delete dimension"
          );
        }

        await loadDimensions();
      } catch (error) {
        console.error(
          "Failed to delete dimension:",
          error
        );

        alert(
          "Unable to delete dimension"
        );
      }
    };

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <div className="max-w-4xl space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Wheel Dimensions
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage the competency dimensions used
          in the Pre and Post Assessment Wheels.
        </p>

      </div>

      {/* TYPE SELECTOR */}

      <div className="flex gap-3">

        <Button
          type="button"
          variant={
            wheelType === "PRE"
              ? "default"
              : "outline"
          }
          onClick={() =>
            setWheelType("PRE")
          }
        >
          Pre Assessment Wheel
        </Button>

        <Button
          type="button"
          variant={
            wheelType === "POST"
              ? "default"
              : "outline"
          }
          onClick={() =>
            setWheelType("POST")
          }
        >
          Post Assessment Wheel
        </Button>

      </div>

      {/* ADD DIMENSION */}

      <Card>

        <CardContent className="p-6">

          <div className="space-y-4">

            <div>

              <Label>
                Add New Dimension
              </Label>

              <p className="text-xs text-slate-500 mt-1">
                Add a competency dimension to the{" "}
                {wheelType === "PRE"
                  ? "Pre Assessment"
                  : "Post Assessment"}{" "}
                Wheel.
              </p>

            </div>

            <div className="flex gap-3">

              <Input
                value={newDimension}
                onChange={(event) =>
                  setNewDimension(
                    event.target.value
                  )
                }
                placeholder="e.g. Communication Skills"
              />

              <Button
                type="button"
                onClick={
                  handleAddDimension
                }
                disabled={
                  saving
                }
              >

                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}

                Add

              </Button>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* DIMENSIONS LIST */}

      <Card>

        <CardContent className="p-6">

          <div className="mb-5">

            <h2 className="font-semibold text-slate-900 dark:text-white">

              {wheelType === "PRE"
                ? "Pre Assessment"
                : "Post Assessment"}{" "}

              Dimensions

            </h2>

            <p className="text-xs text-slate-500 mt-1">

              {dimensions.length} dimension
              {dimensions.length !== 1
                ? "s"
                : ""}{" "}

              configured.

            </p>

          </div>

          {loading ? (

            <div className="py-10 flex justify-center">

              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />

            </div>

          ) : dimensions.length === 0 ? (

            <div className="py-10 text-center text-sm text-slate-500">

              No dimensions have been added yet.

            </div>

          ) : (

            <div className="space-y-3">

              {dimensions.map(
                (
                  dimension,
                  index
                ) => (

                  <div
                    key={dimension.id}
                    className="flex items-center gap-4 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                  >

                    {/* NUMBER */}

                    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">

                      {index + 1}

                    </div>

                    {/* NAME */}

                    <div className="flex-1">

                      {editingId ===
                      dimension.id ? (

                        <Input
                          value={
                            editingName
                          }
                          onChange={(
                            event
                          ) =>
                            setEditingName(
                              event.target
                                .value
                            )
                          }
                        />

                      ) : (

                        <div>

                          <p className="font-medium text-sm">

                            {dimension.name}

                          </p>

                          <p className="text-xs text-slate-500 mt-1">

                            Sort order:{" "}

                            {
                              dimension.sortOrder
                            }

                          </p>

                        </div>

                      )}

                    </div>

                    {/* STATUS */}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleToggleActive(
                          dimension
                        )
                      }
                    >

                      {dimension.isActive
                        ? "Active"
                        : "Inactive"}

                    </Button>

                    {/* EDIT */}

                    {editingId ===
                    dimension.id ? (

                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          handleSaveEdit(
                            dimension.id
                          )
                        }
                      >

                        <Save className="w-4 h-4" />

                      </Button>

                    ) : (

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStartEdit(
                            dimension
                          )
                        }
                      >

                        <Pencil className="w-4 h-4" />

                      </Button>

                    )}

                    {/* DELETE */}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDelete(
                          dimension.id
                        )
                      }
                      className="text-red-500 hover:text-red-600"
                    >

                      <Trash2 className="w-4 h-4" />

                    </Button>

                  </div>

                )
              )}

            </div>

          )}

        </CardContent>

      </Card>

    </div>
  );
}