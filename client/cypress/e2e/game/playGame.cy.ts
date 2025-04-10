describe("playGame", () => {
  describe("normal mode", () => {
    it("should launch the game in easy mode", () => {});

    it("should display the game informations", () => {});

    it("should display the end game modal when the time runs out", () => {});

    it("should display the good answer pin after 3 wrong guesses", () => {});

    test("update the score after a good guess", () => {
      it("should update by 3000 points if it's the first guess", () => {});

      it("should update by 2000 points if it's the second guess", () => {});

      it("should update by 1000 points if it's the third guess", () => {});
    });

    it("should display a new round after a good guess", () => {});

    test("when the user clicks on the back button", () => {
      it("should go back to the main menu", () => {});

      it("should stay to the current game", () => {});
    });

    describe("when the game is over", () => {
      it("should display the final score", () => {});

      it("should display the back button and go to the main page", () => {});

      it("should display the play again button and launch a new game", () => {});

      it("should display the stats link and go to the stats", () => {});

      test("when the user is not connected", () => {
        it("should display the correct text and the signup button", () => {});
      });

      test("when the user is connected", () => {
        it("should display text if the user has beated his previous score", () => {});

        it("should display a text if the user has not beated his previous score", () => {});
      });
    });
  });

  describe("training game", () => {
    it("should launch the game in training mode", () => {});

    it("should not display the timer", () => {});

    it("should display the division name", () => {});

    it("should display the next button to go to the next round", () => {});

    it("should display the finish button to end the game", () => {});

    test("when the game is over", () => {
      it("should display the end game modal", () => {});

      it("should only display the final score", () => {});

      it("should display the back button and go to the main page", () => {});

      it("should display the play again button and launch a new game", () => {});

      it("should display the stats link and go to the stats", () => {});
    });
  });
});
