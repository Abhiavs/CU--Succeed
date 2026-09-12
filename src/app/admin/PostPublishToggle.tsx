"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, GlobeLock } from "lucide-react";

export default function PostPublishToggle() {
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/admin/post-publish");
      const data = await res.json();
      setPublished(data.published ?? false);
    } catch (error) {
      console.error("Failed to fetch POST publish status:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async () => {
    setToggling(true);
    try {
      const res = await fetch("/api/admin/post-publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });

      const data = await res.json();

      if (data.success) {
        setPublished(data.published);
      } else {
        alert("Failed to toggle POST assessment publish status");
      }
    } catch (error) {
      console.error("Failed to toggle POST publish:", error);
      alert("An error occurred while toggling POST assessment");
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {published ? (
          <Badge className="bg-indigo-500">
            <Globe className="mr-1 h-3 w-3" />
            POST Published
          </Badge>
        ) : (
          <Badge variant="outline" className="text-slate-500">
            <GlobeLock className="mr-1 h-3 w-3" />
            POST Hidden
          </Badge>
        )}
      </div>

      <Button
        size="sm"
        variant={published ? "outline" : "default"}
        onClick={togglePublish}
        disabled={toggling}
      >
        {toggling ? (
          <span className="flex items-center gap-2">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Updating...
          </span>
        ) : published ? (
          "Hide POST Assessment"
        ) : (
          "Publish POST Assessment"
        )}
      </Button>
    </div>
  );
}
